import { repositoryFileSystem } from "./fileSystem";
import { assertCurrentFormat, parseJsonDocument, serializeDocument } from "./format";
import { repositoryPaths } from "./paths";
import {
  type AppData,
  CURRENT_FORMAT_VERSION,
  type ProjectListEntry,
  type ProjectMetadata,
  type TrashIndexDocument,
} from "./types";

const defaultAppData = (): AppData => ({
  formatVersion: CURRENT_FORMAT_VERSION,
  lastProjectKey: null,
  settings: {},
});

export const tauriAppRepository = {
  async initializeApp(): Promise<AppData> {
    await Promise.all([
      repositoryFileSystem.ensureDirectory(repositoryPaths.projectsDirectory()),
      repositoryFileSystem.ensureDirectory(repositoryPaths.trashRecordsDirectory()),
      repositoryFileSystem.ensureDirectory(repositoryPaths.trashedProjectsDirectory()),
    ]);

    const appPath = repositoryPaths.appFile();
    if (!(await repositoryFileSystem.exists(appPath))) {
      const app = defaultAppData();
      await repositoryFileSystem.writeTextAtomically(appPath, serializeDocument(app));
      await ensureTrashIndex();
      return app;
    }

    await ensureTrashIndex();

    const app = parseJsonDocument<AppData>(appPath, await repositoryFileSystem.readText(appPath));
    assertCurrentFormat(appPath, app);
    return app;
  },

  async saveApp(app: AppData): Promise<void> {
    const appPath = repositoryPaths.appFile();
    assertCurrentFormat(appPath, app);
    await repositoryFileSystem.writeTextAtomically(appPath, serializeDocument(app));
  },

  async listProjects(): Promise<ProjectListEntry[]> {
    const projectKeys = await repositoryFileSystem.listDirectory(repositoryPaths.projectsDirectory());

    return Promise.all(projectKeys.map(async (projectKey): Promise<ProjectListEntry> => {
      const projectPath = repositoryPaths.projectFile(projectKey);

      try {
        const metadata = parseJsonDocument<ProjectMetadata>(
          projectPath,
          await repositoryFileSystem.readText(projectPath),
        );
        assertCurrentFormat(projectPath, metadata);

        if (metadata.__key !== projectKey) {
          throw new Error("The project key does not match its directory.");
        }

        return {
          status: "available",
          project: {
            __key: metadata.__key,
            name: metadata.name,
            info: metadata.info,
            updatedAt: metadata.updatedAt,
          },
        };
      } catch (error) {
        return {
          status: "unreadable",
          projectKey,
          error: error instanceof Error ? error.message : "Unable to read project metadata.",
        };
      }
    }));
  },
};

async function ensureTrashIndex(): Promise<void> {
  const trashIndexPath = repositoryPaths.trashIndexFile();
  if (await repositoryFileSystem.exists(trashIndexPath)) {
    return;
  }

  const index: TrashIndexDocument = {
    formatVersion: CURRENT_FORMAT_VERSION,
    records: [],
  };
  await repositoryFileSystem.writeTextAtomically(trashIndexPath, serializeDocument(index));
}
