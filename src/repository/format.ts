import { CURRENT_FORMAT_VERSION } from "./types";

export class FormatError extends Error {
  constructor(
    public readonly path: string,
    message: string,
  ) {
    super(message);
    this.name = "FormatError";
  }
}

export class InvalidJsonError extends FormatError {}

export function parseJsonDocument<T>(path: string, content: string): T {
  try {
    return JSON.parse(content) as T;
  } catch {
    throw new InvalidJsonError(path, "The file does not contain valid JSON.");
  }
}

export function assertCurrentFormat(path: string, document: { formatVersion: number }): void {
  if (document.formatVersion !== CURRENT_FORMAT_VERSION) {
    throw new FormatError(path, `Unsupported format version: ${document.formatVersion}`);
  }
}

export function serializeDocument(document: object): string {
  return JSON.stringify(document, null, 2);
}
