import { reactive, ref, toRaw } from "vue";
import { nanoid } from "nanoid";
import { appSetting, changeAppSetting } from "../app/appSetting";
import { showPopUp } from "../pages/popUp";
import { showAlert, showOperationError } from "../alert";
import { hidePage } from "../pages/pageChange";
import { getShowOnMainInfo, showLastTargetOnMain, showTargetOnMain } from "../pages/mainPage/showOnMain";
import { nowAllExitence, changeNowAllExitence } from "../all-exitence/allExitence";
import { nowAllArticles, changeNowAllArticles } from "../all-articles/allArticles";
import { tauriCoreProjectRepository, moveProjectToTrash } from "@/repository/tauriProjectRepository";
import { tauriAppRepository } from "@/repository/tauriAppRepository";
import { tauriFeatureRepository } from "@/repository/tauriFeatureRepository";
import { loadProjectFeatures as getProjectFeatures } from "@/repository/projectFeatures";
import { setActiveTrashProject } from "./trash";
import { runPendingAction } from "@/hooks/app/pendingAction";
import { InvalidJsonError } from "@/repository/format";
import type {
  ProjectData,
  ProjectLastTarget as RepositoryProjectLastTarget,
  ProjectMetadata,
  ProjectSummary,
} from "@/repository/types";
import type { Type } from "@/class/Type";
import type { Article } from "@/class/Article";
import type { Chapter } from "@/class/Chapter";

export type ProjectLastTarget = RepositoryProjectLastTarget;

export type ProjectInfo = {
  __key: string;
  name: string;
  // Retained for existing UI consumers; it is now the immutable project key, not a folder name.
  pathName: string;
  time: number;
  createdAt: number;
  info?: string;
  lastTarget: ProjectLastTarget;
};

export const nowProjectList = ref<ProjectInfo[]>([]);
export const nowProjectPath = ref<string | null>(null);
export const nowProjectInfo = reactive<ProjectInfo>({
  __key: "",
  name: "",
  pathName: "",
  time: 0,
  createdAt: 0,
  info: "",
  lastTarget: null,
});

const projectSaveQueues = new Map<string, Promise<void>>();
const corruptProjectFeatures = new Map<string, Set<string>>();

function toProjectInfo(metadata: ProjectMetadata | ProjectSummary): ProjectInfo {
  return {
    __key: metadata.__key,
    name: metadata.name,
    pathName: metadata.__key,
    time: metadata.updatedAt,
    createdAt: "createdAt" in metadata ? metadata.createdAt : metadata.updatedAt,
    info: metadata.info,
    lastTarget: "lastTarget" in metadata ? metadata.lastTarget : null,
  };
}

type CorruptFeature = { key: string; error: unknown };

async function loadProjectFeatures(projectKey: string): Promise<CorruptFeature[]> {
  const corruptFeatures: CorruptFeature[] = [];
  for (const feature of await getProjectFeatures()) {
    try {
      const data = await tauriFeatureRepository.load(projectKey, feature.key);
      if (data === null) {
        const defaultData = feature.createDefault();
        feature.load(defaultData);
        await tauriFeatureRepository.save(projectKey, feature.key, defaultData);
        corruptProjectFeatures.get(projectKey)?.delete(feature.key);
      } else {
        feature.load(data);
        corruptProjectFeatures.get(projectKey)?.delete(feature.key);
      }
    } catch (error) {
      // A corrupt auxiliary file must not make its project unavailable or overwrite the evidence.
      console.error(`无法读取辅助功能文件：${feature.key}`, error);
      feature.load(feature.createDefault());
      let keys = corruptProjectFeatures.get(projectKey);
      if (!keys) {
        keys = new Set();
        corruptProjectFeatures.set(projectKey, keys);
      }
      keys.add(feature.key);
      corruptFeatures.push({ key: feature.key, error });
    }
  }
  return corruptFeatures;
}

function isProjectFeatureCorrupt(projectKey: string, featureKey: string): boolean {
  return corruptProjectFeatures.get(projectKey)?.has(featureKey) ?? false;
}

function featureName(featureKey: string): string {
  const names: Record<string, string> = {
    "input-suggestion": "输入建议",
    "quick-draft": "暂记版",
    "tag-library": "标签库",
  };
  return names[featureKey] ?? featureKey;
}

export async function resetProjectFeature(projectKey: string, featureKey: string): Promise<void> {
  const feature = (await getProjectFeatures()).find((item) => item.key === featureKey);
  if (!feature) throw new Error(`未找到辅助功能：${featureKey}`);

  const data = feature.createDefault();
  await enqueueProjectSave(projectKey, () => tauriFeatureRepository.save(projectKey, featureKey, data));
  corruptProjectFeatures.get(projectKey)?.delete(featureKey);
  if (nowProjectPath.value === projectKey) feature.load(data);
}

function showFeatureResetAlert(projectKey: string, feature: CorruptFeature): void {
  const name = featureName(feature.key);
  if (!(feature.error instanceof InvalidJsonError)) {
    showAlert({
      title: "辅助功能数据无法读取",
      info: `无法读取“${name}”的数据。原文件不会被覆盖，请检查文件及访问权限。`,
      confirm: () => {},
      quit: null,
    });
    return;
  }
  showAlert({
    title: "辅助功能数据损坏",
    info: `“${name}”的数据文件无法读取。项目其他内容不受影响。`,
    confirm: null,
    quit: null,
    buttons: [
      {
        name: "重置此功能数据",
        click: () => {
          showAlert({
            info: `确定重置“${name}”的数据？原文件内容将被默认数据覆盖。`,
            confirm: () => {
              void resetProjectFeature(projectKey, feature.key).catch((error) => {
                console.error(error);
                showAlert({ info: `重置“${name}”失败，原文件仍被保留。`, confirm: () => {} });
              });
            },
          });
        },
      },
      { name: "暂不处理", click: () => {} },
    ],
  });
}

function cloneForStorage<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function enqueueProjectSave(projectKey: string, write: () => Promise<void>): Promise<void> {
  const previous = projectSaveQueues.get(projectKey) ?? Promise.resolve();
  const current = previous.catch(() => undefined).then(write);
  projectSaveQueues.set(projectKey, current.catch(() => undefined));
  return current;
}

export async function initProject(): Promise<void> {
  const entries = await tauriAppRepository.listProjects();
  nowProjectList.value = entries
    .filter((entry) => entry.status === "available")
    .map((entry) => toProjectInfo(entry.project));

  const lastProjectKey = appSetting.lastProjectKey;
  if (typeof lastProjectKey === "string" && nowProjectList.value.some((project) => project.__key === lastProjectKey)) {
    await moveToProject(lastProjectKey);
  } else {
    onNoProject();
  }
}

export async function syncProject(projectKey: string): Promise<boolean> {
  try {
    const project = await tauriCoreProjectRepository.loadProject(projectKey);
    nowProjectPath.value = projectKey;
    setActiveTrashProject(projectKey);
    Object.assign(nowProjectInfo, toProjectInfo(project.metadata));
    changeNowAllExitence(project.exitence);
    changeNowAllArticles(project.articles);
    const corruptFeatures = await loadProjectFeatures(projectKey);
    corruptFeatures.forEach((feature) => showFeatureResetAlert(projectKey, feature));
    return true;
  } catch (error) {
    console.error(error);
    showOperationError("读取项目", error);
    return false;
  }
}

export async function readProjectData(projectKey: string, target: "exitence" | "article") {
  const project = await tauriCoreProjectRepository.loadProject(projectKey);
  return target === "exitence" ? project.exitence : project.articles;
}

export async function saveProject(): Promise<boolean> {
  const projectKey = nowProjectPath.value;
  if (!projectKey) return false;

  try {
    await saveProjectInfo();
    const metadata: ProjectMetadata = {
      formatVersion: 1,
      __key: nowProjectInfo.__key,
      name: nowProjectInfo.name,
      info: nowProjectInfo.info ?? "",
      createdAt: nowProjectInfo.createdAt,
      updatedAt: Date.now(),
      lastTarget: cloneForStorage(nowProjectInfo.lastTarget),
    };
    const project: ProjectData = {
      metadata,
      articles: cloneForStorage({ formatVersion: 1, ...toRaw(nowAllArticles) }),
      exitence: cloneForStorage({ formatVersion: 1, ...toRaw(nowAllExitence) }),
    };
    const featureSnapshots = (await getProjectFeatures())
      .filter((feature) => !isProjectFeatureCorrupt(projectKey, feature.key))
      .map((feature) => ({
        key: feature.key,
        data: cloneForStorage(feature.snapshot()),
      }));

    await enqueueProjectSave(projectKey, async () => {
      await tauriCoreProjectRepository.saveProject(project);
      for (const feature of featureSnapshots) {
        await tauriFeatureRepository.save(projectKey, feature.key, feature.data);
      }
    });
    if (nowProjectInfo.__key === projectKey) nowProjectInfo.time = metadata.updatedAt;
    const listItem = nowProjectList.value.find((project) => project.__key === projectKey);
    if (listItem) listItem.time = metadata.updatedAt;
    return true;
  } catch (error) {
    console.error(error);
    showOperationError("保存项目", error);
    return false;
  }
}

export async function saveProjectInfo(): Promise<boolean> {
  if (!nowProjectPath.value || !nowProjectInfo.__key) return false;
  const showOnMainInfo = getShowOnMainInfo();
  if (showOnMainInfo) {
    nowProjectInfo.lastTarget = showOnMainInfo;
  }
  return true;
}

export function onNoProject(): void {
  showTargetOnMain({ type: "info", target: "app" });
  nowProjectPath.value = null;
  setActiveTrashProject(null);
  Object.assign(nowProjectInfo, {
    __key: "",
    name: "点击此处创建新项目",
    pathName: "",
    time: 0,
    createdAt: 0,
    info: "",
    lastTarget: null,
  });
}

export function onNoContent(): void {
  showTargetOnMain({ type: "info", target: "project" });
}

export async function moveToProject(projectKey: string): Promise<void> {
  if (nowProjectPath.value) {
    await saveProject();
  }
  if (projectKey === nowProjectPath.value) return;

  if (await syncProject(projectKey)) {
    showLastTargetOnMain(nowProjectInfo.lastTarget);
    await changeAppSetting("lastProjectKey", projectKey);
    return;
  }

  onNoProject();
}

export function moveToNextProject(index: number): void {
  const nextProject = nowProjectList.value[index];
  if (nextProject) {
    void moveToProject(nextProject.__key);
  } else {
    onNoProject();
    void changeAppSetting("lastProjectKey", null);
  }
}

export async function createProject(name: string, info = ""): Promise<void> {
  const now = Date.now();
  const metadata: ProjectMetadata = {
    formatVersion: 1,
    __key: nanoid(),
    name,
    info,
    createdAt: now,
    updatedAt: now,
    lastTarget: null,
  };
  const project: ProjectData = {
    metadata,
    articles: { formatVersion: 1, chapters: [], articles: [] },
    exitence: { formatVersion: 1, types: [] },
  };
  await tauriCoreProjectRepository.createProject(project);
  for (const feature of await getProjectFeatures()) {
    await tauriFeatureRepository.save(metadata.__key, feature.key, feature.createDefault());
  }
  nowProjectList.value.push(toProjectInfo(metadata));
  await moveToProject(metadata.__key);
  hidePage("project");
}

export async function createNewProject(): Promise<void> {
  showPopUp({
    vueName: "createProject",
    buttons: [],
    mask: true,
    size: { height: "auto" },
    returnValue: (name: string, info: string) => {
      void createProject(name, info);
    },
  });
}

async function updateProject(projectInfo: ProjectInfo, newName: string, newInfo: string): Promise<void> {
  if (nowProjectInfo.__key === projectInfo.__key) {
    nowProjectInfo.name = newName;
    nowProjectInfo.info = newInfo;
    await saveProject();
    Object.assign(projectInfo, nowProjectInfo);
    return;
  }

  const project = await tauriCoreProjectRepository.loadProject(projectInfo.__key);
  project.metadata.name = newName;
  project.metadata.info = newInfo;
  project.metadata.updatedAt = Date.now();
  await tauriCoreProjectRepository.saveProject(project);
  Object.assign(projectInfo, toProjectInfo(project.metadata));
}

export function editProjectInfo(projectInfo: ProjectInfo): void {
  showPopUp({
    vueName: "editProject",
    buttons: [],
    mask: false,
    size: { height: "auto" },
    props: { project: projectInfo },
    returnValue: (name: string, info: string) => {
      void updateProject(projectInfo, name, info);
    },
  });
}

export async function deleteProject(projectInfo: ProjectInfo): Promise<void> {
  showAlert({
    info: `是否删除项目:${projectInfo.name}\n项目将移动到全局回收站。`,
    confirm: async () => {
      try {
        await runPendingAction(`project-delete:${projectInfo.__key}`, async () => {
          const project = await tauriCoreProjectRepository.loadProject(projectInfo.__key);
          await moveProjectToTrash(project.metadata);
          const index = nowProjectList.value.indexOf(projectInfo);
          nowProjectList.value.splice(index, 1);
          if (nowProjectInfo.__key === projectInfo.__key) {
            moveToNextProject(index);
          }
        });
      } catch (error) {
        console.error(error);
        showAlert({ info: "移动项目到回收站失败，项目未被删除。", confirm: () => {} });
      }
    },
  });
}

export type ProjectExitenceData = { types: Type[] };
export type ProjectArticleData = { articles: Article[]; chapters: Chapter[] };
