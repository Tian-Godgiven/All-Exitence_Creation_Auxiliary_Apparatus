import { createTrashRecord } from "@/repository/tauriProjectRepository";
import type { TrashKind, TrashParent } from "@/repository/types";
import { isActionPending, runPendingAction } from "@/hooks/app/pendingAction";
import { showAlert } from "@/hooks/alert";

let activeProjectKey: string | null = null;

export function setActiveTrashProject(projectKey: string | null): void {
  activeProjectKey = projectKey;
}

export async function moveObjectToTrash(input: {
  kind: Exclude<TrashKind, "project">;
  parent: TrashParent;
  index: number;
  label: string;
  snapshot: unknown;
}, remove: () => void): Promise<boolean> {
  if (!activeProjectKey) {
    throw new Error("无法删除对象：当前没有打开的项目。");
  }

  const snapshotKey = (input.snapshot as { __key?: string }).__key ?? input.label;
  const actionKey = `trash:${input.kind}:${snapshotKey}`;
  if (isActionPending(actionKey)) return false;
  const projectKey = activeProjectKey;
  const result = await runPendingAction(actionKey, async () => {
    await createTrashRecord({ ...input, projectKey });
    remove();
    const { nowProjectPath, saveProject } = await import("./project");
    if (nowProjectPath.value !== projectKey || !(await saveProject())) {
      showAlert({
        info: "对象已放入回收站，但项目保存失败。请返回原项目后手动保存；在保存成功前不要退出应用。",
        confirm: () => {},
      });
      return false;
    }
    return true;
  });
  return result === true;
}
