import { reactive } from "vue";

const pendingActions = reactive(new Set<string>());

export function isActionPending(key: string): boolean {
  return pendingActions.has(key);
}

export async function runPendingAction<T>(key: string, action: () => Promise<T>): Promise<T | undefined> {
  if (pendingActions.has(key)) {
    return undefined;
  }

  pendingActions.add(key);
  try {
    return await action();
  } finally {
    pendingActions.delete(key);
  }
}
