import { Article } from "@/class/Article";
import { Chapter } from "@/class/Chapter";
import { Type } from "@/class/Type";

export const CURRENT_FORMAT_VERSION = 1;

export type ProjectLastTarget =
  | { type: "exitence"; from: string; targetKey: string }
  | { type: "article"; from: string[]; targetKey: string }
  | { type: "info"; from: null; targetKey: "app" | "project" }
  | null;

export interface AppData {
  formatVersion: number;
  lastProjectKey: string | null;
  settings: Record<string, unknown>;
}

export interface ProjectMetadata {
  formatVersion: number;
  __key: string;
  name: string;
  info: string;
  createdAt: number;
  updatedAt: number;
  lastTarget: ProjectLastTarget;
}

export interface ProjectSummary {
  __key: string;
  name: string;
  info: string;
  updatedAt: number;
}

export type ProjectListEntry =
  | { status: "available"; project: ProjectSummary }
  | { status: "unreadable"; projectKey: string; error: string };

export interface ArticlesDocument {
  formatVersion: number;
  chapters: Chapter[];
  articles: Article[];
}

export interface ExitenceDocument {
  formatVersion: number;
  types: Type[];
}

export interface ProjectData {
  metadata: ProjectMetadata;
  articles: ArticlesDocument;
  exitence: ExitenceDocument;
}

export interface FeatureDocument<T> {
  formatVersion: number;
  data: T;
}

export type TrashKind = "project" | "article" | "chapter" | "exitence" | "type" | "group";

export interface TrashParent {
  kind: "root" | "chapter" | "type";
  __key: string | null;
}

export interface TrashRecord {
  formatVersion: number;
  __key: string;
  kind: TrashKind;
  deletedAt: number;
  projectKey: string | null;
  parent: TrashParent | null;
  index: number | null;
  snapshot?: unknown;
}

export interface TrashIndexEntry {
  __key: string;
  kind: TrashKind;
  deletedAt: number;
  projectKey: string | null;
  label: string;
}

export interface TrashIndexDocument {
  formatVersion: number;
  records: TrashIndexEntry[];
}
