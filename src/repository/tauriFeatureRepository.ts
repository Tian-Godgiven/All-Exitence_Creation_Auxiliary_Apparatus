import { repositoryFileSystem } from "./fileSystem";
import { assertCurrentFormat, parseJsonDocument, serializeDocument } from "./format";
import { repositoryPaths } from "./paths";
import { CURRENT_FORMAT_VERSION, type FeatureDocument } from "./types";

export const tauriFeatureRepository = {
  async loadGlobal<T>(featureKey: string): Promise<T | null> {
    const path = repositoryPaths.globalFeatureFile(featureKey);
    if (!(await repositoryFileSystem.exists(path))) return null;
    const document = parseJsonDocument<FeatureDocument<T>>(path, await repositoryFileSystem.readText(path));
    assertCurrentFormat(path, document);
    return document.data;
  },

  async saveGlobal<T>(featureKey: string, data: T): Promise<void> {
    await repositoryFileSystem.ensureDirectory(repositoryPaths.globalFeaturesDirectory());
    const document: FeatureDocument<T> = { formatVersion: CURRENT_FORMAT_VERSION, data };
    await repositoryFileSystem.writeTextAtomically(repositoryPaths.globalFeatureFile(featureKey), serializeDocument(document));
  },

  async load<T>(projectKey: string, featureKey: string): Promise<T | null> {
    const featurePath = repositoryPaths.featureFile(projectKey, featureKey);
    if (!(await repositoryFileSystem.exists(featurePath))) {
      return null;
    }

    const document = parseJsonDocument<FeatureDocument<T>>(
      featurePath,
      await repositoryFileSystem.readText(featurePath),
    );
    assertCurrentFormat(featurePath, document);
    return document.data;
  },

  async save<T>(projectKey: string, featureKey: string, data: T): Promise<void> {
    await repositoryFileSystem.ensureDirectory(repositoryPaths.featuresDirectory(projectKey));

    const document: FeatureDocument<T> = {
      formatVersion: CURRENT_FORMAT_VERSION,
      data,
    };
    await repositoryFileSystem.writeTextAtomically(
      repositoryPaths.featureFile(projectKey, featureKey),
      serializeDocument(document),
    );
  },

  async remove(projectKey: string, featureKey: string): Promise<void> {
    const featurePath = repositoryPaths.featureFile(projectKey, featureKey);
    if (await repositoryFileSystem.exists(featurePath)) {
      await repositoryFileSystem.remove(featurePath);
    }
  },
};
