import { repositoryFileSystem, RepositoryFileError } from "./fileSystem";
import { assertCurrentFormat, FormatError, parseJsonDocument, serializeDocument } from "./format";
import { repositoryPaths } from "./paths";
import { nanoid } from "nanoid";
import { tauriFeatureRepository } from "./tauriFeatureRepository";
import type { Article } from "@/class/Article";
import type { Chapter } from "@/class/Chapter";
import type { Type } from "@/class/Type";
import type { Exitence } from "@/class/Exitence";
import type { InputSuggestionData } from "@/supportAbility/inputSuggestion/main";
import type { CoreProjectRepository } from "./projectRepository";
import {
  type ArticlesDocument,
  type ExitenceDocument,
  type ProjectData,
  type ProjectMetadata,
  type TrashIndexDocument,
  type TrashRecord,
  type TrashKind,
  type TrashParent,
  type TrashIndexEntry,
} from "./types";

export const tauriCoreProjectRepository: CoreProjectRepository = {
  async createProject(project: ProjectData): Promise<void> {
    const projectDirectory = repositoryPaths.projectDirectory(project.metadata.__key);

    if (await repositoryFileSystem.exists(projectDirectory)) {
      throw new RepositoryFileError("directory", projectDirectory, "A project with this key already exists.");
    }

    await repositoryFileSystem.ensureDirectory(repositoryPaths.featuresDirectory(project.metadata.__key));
    await tauriCoreProjectRepository.saveProject(project);
  },

  async loadProject(projectKey: string): Promise<ProjectData> {
    const metadataPath = repositoryPaths.projectFile(projectKey);
    const articlesPath = repositoryPaths.articlesFile(projectKey);
    const exitencePath = repositoryPaths.exitenceFile(projectKey);

    const [metadataText, articlesText, exitenceText] = await Promise.all([
      repositoryFileSystem.readText(metadataPath),
      repositoryFileSystem.readText(articlesPath),
      repositoryFileSystem.readText(exitencePath),
    ]);
    const metadata = parseJsonDocument<ProjectMetadata>(metadataPath, metadataText);
    const articles = parseJsonDocument<ArticlesDocument>(articlesPath, articlesText);
    const exitence = parseJsonDocument<ExitenceDocument>(exitencePath, exitenceText);

    assertCurrentFormat(metadataPath, metadata);
    assertCurrentFormat(articlesPath, articles);
    assertCurrentFormat(exitencePath, exitence);

    if (metadata.__key !== projectKey) {
      throw new FormatError(metadataPath, "The project key does not match its directory.");
    }

    return { metadata, articles, exitence };
  },

  async saveProject(project: ProjectData): Promise<void> {
    const projectKey = project.metadata.__key;
    const metadataPath = repositoryPaths.projectFile(projectKey);
    const articlesPath = repositoryPaths.articlesFile(projectKey);
    const exitencePath = repositoryPaths.exitenceFile(projectKey);

    assertCurrentFormat(metadataPath, project.metadata);
    assertCurrentFormat(articlesPath, project.articles);
    assertCurrentFormat(exitencePath, project.exitence);

    await Promise.all([
      repositoryFileSystem.writeTextAtomically(metadataPath, serializeDocument(project.metadata)),
      repositoryFileSystem.writeTextAtomically(articlesPath, serializeDocument(project.articles)),
      repositoryFileSystem.writeTextAtomically(exitencePath, serializeDocument(project.exitence)),
    ]);
  },
};

export async function moveProjectToTrash(project: ProjectMetadata): Promise<TrashRecord> {
  const recordKey = nanoid();
  const record: TrashRecord = {
    formatVersion: 1,
    __key: recordKey,
    kind: "project",
    deletedAt: Date.now(),
    projectKey: project.__key,
    parent: null,
    index: null,
  };
  const indexPath = repositoryPaths.trashIndexFile();
  const index = parseJsonDocument<TrashIndexDocument>(
    indexPath,
    await repositoryFileSystem.readText(indexPath),
  );
  assertCurrentFormat(indexPath, index);

  await repositoryFileSystem.ensureDirectory(repositoryPaths.trashedProjectRecordDirectory(recordKey));
  await repositoryFileSystem.move(
    repositoryPaths.projectDirectory(project.__key),
    repositoryPaths.trashedProjectDirectory(recordKey),
  );

  try {
    await repositoryFileSystem.writeTextAtomically(
      repositoryPaths.trashRecordFile(recordKey),
      serializeDocument(record),
    );
    index.records.unshift({
      __key: recordKey,
      kind: "project",
      deletedAt: record.deletedAt,
      projectKey: project.__key,
      label: project.name,
    });
    await repositoryFileSystem.writeTextAtomically(indexPath, serializeDocument(index));
  } catch (error) {
    try {
      await repositoryFileSystem.move(
        repositoryPaths.trashedProjectDirectory(recordKey),
        repositoryPaths.projectDirectory(project.__key),
      );
    } catch {
      // Keep the moved directory intact when rollback itself fails.
    }
    throw error;
  }

  return record;
}

export async function createTrashRecord(input: {
  kind: Exclude<TrashKind, "project">;
  projectKey: string;
  parent: TrashParent;
  index: number;
  label: string;
  snapshot: unknown;
}): Promise<TrashRecord> {
  const record: TrashRecord = {
    formatVersion: 1,
    __key: nanoid(),
    kind: input.kind,
    deletedAt: Date.now(),
    projectKey: input.projectKey,
    parent: input.parent,
    index: input.index,
    snapshot: input.snapshot,
  };
  const indexPath = repositoryPaths.trashIndexFile();
  const index = parseJsonDocument<TrashIndexDocument>(
    indexPath,
    await repositoryFileSystem.readText(indexPath),
  );
  assertCurrentFormat(indexPath, index);

  await repositoryFileSystem.writeTextAtomically(
    repositoryPaths.trashRecordFile(record.__key),
    serializeDocument(record),
  );

  try {
    index.records.unshift({
      __key: record.__key,
      kind: record.kind,
      deletedAt: record.deletedAt,
      projectKey: record.projectKey,
      label: input.label,
    });
    await repositoryFileSystem.writeTextAtomically(indexPath, serializeDocument(index));
  } catch (error) {
    try {
      await repositoryFileSystem.remove(repositoryPaths.trashRecordFile(record.__key));
    } catch {
      // A failed cleanup must not hide the index write failure.
    }
    throw error;
  }

  return record;
}

export async function listTrashRecords(): Promise<TrashIndexEntry[]> {
  const indexPath = repositoryPaths.trashIndexFile();
  const index = parseJsonDocument<TrashIndexDocument>(
    indexPath,
    await repositoryFileSystem.readText(indexPath),
  );
  assertCurrentFormat(indexPath, index);
  return index.records;
}

export async function restoreTrashRecord(recordKey: string): Promise<void> {
  const record = await loadTrashRecord(recordKey);
  if (record.kind === "project") {
    await restoreProjectRecord(record);
    return;
  }

  if (!record.projectKey || !record.parent || record.index === null || record.snapshot === undefined) {
    throw new FormatError(repositoryPaths.trashRecordFile(recordKey), "The trash record is incomplete.");
  }

  const project = await tauriCoreProjectRepository.loadProject(record.projectKey);
  const snapshot = record.snapshot as any;
  if (!snapshot.__key) throw new FormatError(repositoryPaths.trashRecordFile(recordKey), "The snapshot has no key.");
  const insertAt = <T>(items: T[], item: T) => items.splice(Math.min(record.index ?? items.length, items.length), 0, item);

  switch (record.kind) {
    case "article": {
      const parent = record.parent.kind === "chapter" ? findChapter(project.articles.chapters, record.parent.__key) : null;
      if (!findArticle(project.articles, snapshot.__key)) {
        snapshot.from = parent ? [...parent.from, parent.__key] : [];
        insertAt(parent?.articles ?? project.articles.articles, snapshot as Article);
      }
      break;
    }
    case "chapter": {
      const parent = record.parent.kind === "chapter" ? findChapter(project.articles.chapters, record.parent.__key) : null;
      if (!findChapter(project.articles.chapters, snapshot.__key)) {
        updateChapterPaths(snapshot as Chapter, parent ? [...parent.from, parent.__key] : []);
        insertAt(parent?.chapters ?? project.articles.chapters, snapshot as Chapter);
      }
      break;
    }
    case "type":
      if (!project.exitence.types.some((type) => type.__key === snapshot.__key)) insertAt(project.exitence.types, snapshot as Type);
      break;
    case "exitence": {
      const parent = project.exitence.types.find((type) => type.__key === record.parent?.__key);
      if (!parent) throw new Error("原分类不存在，无法恢复该事物。");
      if (!project.exitence.types.some((type) => type.exitence.some((item) => item.__key === snapshot.__key))) insertAt(parent.exitence, snapshot as Exitence);
      break;
    }
    case "group": {
      const parent = project.exitence.types.find((type) => type.__key === record.parent?.__key);
      if (!parent) throw new Error("原分类不存在，无法恢复该分组。");
      if (!project.exitence.types.some((type) => type.groups.some((item) => item.__key === snapshot.__key))) insertAt(parent.groups, snapshot);
      break;
    }
  }

  project.metadata.updatedAt = Date.now();
  await tauriCoreProjectRepository.saveProject(project);
  if (record.kind === "type" || record.kind === "exitence") {
    const type = record.kind === "type"
      ? project.exitence.types.find((item) => item.__key === snapshot.__key)
      : project.exitence.types.find((item) => item.__key === record.parent?.__key);
    const exitences = record.kind === "type" ? type?.exitence : type?.exitence.filter((item) => item.__key === snapshot.__key);
    if (type && exitences) await restoreInputSuggestions(record.projectKey, type, exitences);
  }
  await removeTrashRecord(record.__key);
}

export async function permanentlyDeleteTrashRecord(recordKey: string): Promise<void> {
  const record = await loadTrashRecord(recordKey);
  if (record.kind === "project") {
    const directory = repositoryPaths.trashedProjectRecordDirectory(record.__key);
    if (await repositoryFileSystem.exists(directory)) {
      await repositoryFileSystem.remove(directory, true);
    }
  }
  await removeTrashRecord(record.__key);
}

async function restoreProjectRecord(record: TrashRecord): Promise<void> {
  if (!record.projectKey) {
    throw new FormatError(repositoryPaths.trashRecordFile(record.__key), "The project trash record has no project key.");
  }
  const target = repositoryPaths.projectDirectory(record.projectKey);
  if (await repositoryFileSystem.exists(target)) {
    throw new Error("已有同一项目标识的活跃项目，无法恢复。");
  }
  const source = repositoryPaths.trashedProjectDirectory(record.__key);
  if (!(await repositoryFileSystem.exists(source))) {
    throw new FormatError(source, "The deleted project directory is missing.");
  }
  await repositoryFileSystem.move(source, target);
  await removeTrashRecord(record.__key);
}

async function loadTrashRecord(recordKey: string): Promise<TrashRecord> {
  const path = repositoryPaths.trashRecordFile(recordKey);
  const record = parseJsonDocument<TrashRecord>(path, await repositoryFileSystem.readText(path));
  assertCurrentFormat(path, record);
  return record;
}

async function removeTrashRecord(recordKey: string): Promise<void> {
  const indexPath = repositoryPaths.trashIndexFile();
  const index = parseJsonDocument<TrashIndexDocument>(
    indexPath,
    await repositoryFileSystem.readText(indexPath),
  );
  assertCurrentFormat(indexPath, index);
  index.records = index.records.filter((entry) => entry.__key !== recordKey);
  await repositoryFileSystem.writeTextAtomically(indexPath, serializeDocument(index));
  const recordPath = repositoryPaths.trashRecordFile(recordKey);
  if (await repositoryFileSystem.exists(recordPath)) {
    await repositoryFileSystem.remove(recordPath);
  }
}

function findChapter(chapters: Chapter[], key: string | null): Chapter | null {
  for (const chapter of chapters) {
    if (chapter.__key === key) return chapter;
    const found = findChapter(chapter.chapters, key);
    if (found) return found;
  }
  return null;
}

function findArticle(parent: { articles: Article[]; chapters: Chapter[] }, key: string): boolean {
  return parent.articles.some((article) => article.__key === key) || parent.chapters.some((chapter) => findArticle(chapter, key));
}

function updateChapterPaths(chapter: Chapter, from: string[]): void {
  chapter.from = from;
  const childPath = [...from, chapter.__key];
  chapter.articles.forEach((article) => { article.from = [...childPath]; });
  chapter.chapters.forEach((child) => updateChapterPaths(child, [...childPath]));
}

async function restoreInputSuggestions(projectKey: string, type: Type, exitences: Exitence[]): Promise<void> {
  const data = await tauriFeatureRepository.load<InputSuggestionData>(projectKey, "input-suggestion");
  if (!data || !data.exitence) throw new Error("输入建议文件无法读取，恢复记录已保留。 ");
  for (const exitence of exitences) {
    if (data.exitence[exitence.__key]) continue;
    const item: { text: string; target: string; info: string; nickName?: unknown } = {
      text: exitence.name, target: type.__key, info: "创建的事物",
    };
    const setting = { ...type.setting, ...exitence.setting };
    if (setting.nickName != null) {
      const status = exitence.status.find((entry) => entry.__key === setting.nickName);
      if (status) item.nickName = status.value;
    }
    data.exitence[exitence.__key] = item;
  }
  await tauriFeatureRepository.save(projectKey, "input-suggestion", data);
}
