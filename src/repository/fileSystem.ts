import {
  BaseDirectory,
  exists,
  mkdir,
  readDir,
  readTextFile,
  remove,
  rename,
  writeTextFile,
} from "@tauri-apps/plugin-fs";

const appLocalData = { baseDir: BaseDirectory.AppLocalData };

export type RepositoryFileErrorCode = "not-found" | "read" | "write" | "move" | "remove" | "directory";

export class RepositoryFileError extends Error {
  constructor(
    public readonly code: RepositoryFileErrorCode,
    public readonly path: string,
    public readonly originalError: unknown,
  ) {
    super(`Unable to ${code} ${path}`);
    this.name = "RepositoryFileError";
  }
}

function temporaryPath(path: string): string {
  return `${path}.${crypto.randomUUID()}.tmp`;
}

export const repositoryFileSystem = {
  async exists(path: string): Promise<boolean> {
    try {
      return await exists(path, appLocalData);
    } catch (error) {
      throw new RepositoryFileError("read", path, error);
    }
  },

  async ensureDirectory(path: string): Promise<void> {
    try {
      await mkdir(path, { ...appLocalData, recursive: true });
    } catch (error) {
      throw new RepositoryFileError("directory", path, error);
    }
  },

  async readText(path: string): Promise<string> {
    try {
      return await readTextFile(path, appLocalData);
    } catch (error) {
      throw new RepositoryFileError("read", path, error);
    }
  },

  async listDirectory(path: string): Promise<string[]> {
    try {
      const entries = await readDir(path, appLocalData);
      return entries.map((entry) => entry.name);
    } catch (error) {
      throw new RepositoryFileError("directory", path, error);
    }
  },

  async writeTextAtomically(path: string, content: string): Promise<void> {
    const tempPath = temporaryPath(path);

    try {
      await writeTextFile(tempPath, content, appLocalData);
      await rename(tempPath, path, {
        oldPathBaseDir: BaseDirectory.AppLocalData,
        newPathBaseDir: BaseDirectory.AppLocalData,
      });
    } catch (error) {
      try {
        if (await exists(tempPath, appLocalData)) {
          await remove(tempPath, appLocalData);
        }
      } catch {
        // A failed cleanup must not hide the original write failure.
      }

      throw new RepositoryFileError("write", path, error);
    }
  },

  async move(sourcePath: string, targetPath: string): Promise<void> {
    try {
      await rename(sourcePath, targetPath, {
        oldPathBaseDir: BaseDirectory.AppLocalData,
        newPathBaseDir: BaseDirectory.AppLocalData,
      });
    } catch (error) {
      throw new RepositoryFileError("move", sourcePath, error);
    }
  },

  async remove(path: string, recursive = false): Promise<void> {
    try {
      await remove(path, { ...appLocalData, recursive });
    } catch (error) {
      throw new RepositoryFileError("remove", path, error);
    }
  },
};
