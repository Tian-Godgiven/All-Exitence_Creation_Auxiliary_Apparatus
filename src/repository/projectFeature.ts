export interface ProjectFeature<T> {
  key: string;
  createDefault(): T;
  load(data: T): void;
  snapshot(): T;
}
