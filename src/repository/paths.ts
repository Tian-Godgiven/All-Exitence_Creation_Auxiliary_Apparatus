const ROOT = "data";

function assertPathSegment(value: string, name: string): string {
  if (!value || value === "." || value === ".." || /[\\/:*?"<>|]/.test(value)) {
    throw new Error(`Invalid ${name}`);
  }

  return value;
}

function joinPath(...segments: string[]): string {
  return segments.join("/");
}

export const repositoryPaths = {
  appFile: (): string => joinPath(ROOT, "app.json"),
  globalFeaturesDirectory: (): string => joinPath(ROOT, "features"),
  globalFeatureFile: (featureKey: string): string =>
    joinPath(ROOT, "features", `${assertPathSegment(featureKey, "feature key")}.json`),
  projectsDirectory: (): string => joinPath(ROOT, "projects"),
  projectDirectory: (projectKey: string): string =>
    joinPath(ROOT, "projects", assertPathSegment(projectKey, "project key")),
  projectFile: (projectKey: string): string =>
    joinPath(repositoryPaths.projectDirectory(projectKey), "project.json"),
  articlesFile: (projectKey: string): string =>
    joinPath(repositoryPaths.projectDirectory(projectKey), "articles.json"),
  exitenceFile: (projectKey: string): string =>
    joinPath(repositoryPaths.projectDirectory(projectKey), "exitence.json"),
  featuresDirectory: (projectKey: string): string =>
    joinPath(repositoryPaths.projectDirectory(projectKey), "features"),
  featureFile: (projectKey: string, featureKey: string): string =>
    joinPath(
      repositoryPaths.featuresDirectory(projectKey),
      `${assertPathSegment(featureKey, "feature key")}.json`,
    ),
  trashDirectory: (): string => joinPath(ROOT, "trash"),
  trashIndexFile: (): string => joinPath(ROOT, "trash", "index.json"),
  trashRecordsDirectory: (): string => joinPath(ROOT, "trash", "records"),
  trashRecordFile: (recordKey: string): string =>
    joinPath(ROOT, "trash", "records", `${assertPathSegment(recordKey, "trash record key")}.json`),
  trashedProjectsDirectory: (): string => joinPath(ROOT, "trash", "projects"),
  trashedProjectRecordDirectory: (recordKey: string): string =>
    joinPath(ROOT, "trash", "projects", assertPathSegment(recordKey, "trash record key")),
  trashedProjectDirectory: (recordKey: string): string =>
    joinPath(ROOT, "trash", "projects", assertPathSegment(recordKey, "trash record key"), "project"),
};
