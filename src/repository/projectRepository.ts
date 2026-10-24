import type {
  AppData,
  ProjectData,
  ProjectSummary,
  TrashIndexEntry,
  TrashRecord,
} from "./types";

export interface CoreProjectRepository {
  createProject(project: ProjectData): Promise<void>;
  loadProject(projectKey: string): Promise<ProjectData>;
  saveProject(project: ProjectData): Promise<void>;
}

export interface ProjectRepository {
  initializeApp(): Promise<AppData>;
  saveApp(app: AppData): Promise<void>;

  listProjects(): Promise<ProjectSummary[]>;
  createProject(project: ProjectData): Promise<void>;
  loadProject(projectKey: string): Promise<ProjectData>;
  saveProject(project: ProjectData): Promise<void>;

  listTrash(): Promise<TrashIndexEntry[]>;
  loadTrashRecord(recordKey: string): Promise<TrashRecord>;
  moveProjectToTrash(projectKey: string): Promise<TrashRecord>;
  restoreTrashRecord(recordKey: string): Promise<void>;
  permanentlyDeleteTrashRecord(recordKey: string): Promise<void>;

  loadFeature<T>(projectKey: string, featureKey: string): Promise<T | null>;
  saveFeature<T>(projectKey: string, featureKey: string, data: T): Promise<void>;
  removeFeature(projectKey: string, featureKey: string): Promise<void>;
}
