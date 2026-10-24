<template>
  <div class="recycleBin">
    <div v-if="recycleBinEntries.length" class="featureEntries">
      <Button v-for="entry in recycleBinEntries" :key="entry.name" :name="entry.name" @click="entry.click" />
    </div>
    <div v-if="records.length === 0" class="empty">{{ recycleBinEntries.length ? "通用回收站为空" : "回收站为空" }}</div>
    <div v-for="record in records" :key="record.__key" class="record">
      <div class="recordInfo">
        <div class="label">{{ record.label }}</div>
        <div class="meta">{{ kindLabel(record.kind) }} · {{ formatTime(record.deletedAt) }}</div>
      </div>
      <div class="actions">
        <Button icon="backMain" name="恢复" :disabled="isActionPending(`trash-restore:${record.__key}`)" :loading="isActionPending(`trash-restore:${record.__key}`)" @click="restore(record)"></Button>
        <Button icon="delete" name="永久删除" :disabled="isActionPending(`trash-delete:${record.__key}`)" :loading="isActionPending(`trash-delete:${record.__key}`)" @click="confirmPermanentDelete(record)"></Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import Button from "@/components/global/button.vue";
import { showAlert } from "@/hooks/alert";
import { nowProjectPath, saveProject, syncProject, initProject } from "@/hooks/project/project";
import {
  listTrashRecords,
  permanentlyDeleteTrashRecord,
  restoreTrashRecord,
} from "@/repository/tauriProjectRepository";
import type { TrashIndexEntry, TrashKind } from "@/repository/types";
import { isActionPending, runPendingAction } from "@/hooks/app/pendingAction";
import { supportAbilityList } from "@/static/list/supportAbilityList";

const records = ref<TrashIndexEntry[]>([]);
const recycleBinEntries = supportAbilityList.flatMap((ability) => ability.recycleBinEntry ? [ability.recycleBinEntry] : []);

onMounted(() => {
  void reload();
});

async function reload(): Promise<void> {
  records.value = await listTrashRecords();
}

async function restore(record: TrashIndexEntry): Promise<void> {
  try {
    await runPendingAction(`trash-restore:${record.__key}`, async () => {
      const isCurrentProject = record.projectKey !== null && record.projectKey === nowProjectPath.value;
      if (isCurrentProject && !(await saveProject())) throw new Error("保存当前项目失败。");
      await restoreTrashRecord(record.__key);
      if (record.kind === "project") {
        await initProject();
      } else if (isCurrentProject && record.projectKey) {
        await syncProject(record.projectKey);
      }
      await reload();
    });
  } catch (error) {
    console.error(error);
    showAlert({ info: "恢复失败。原项目或原父级可能已不存在。", confirm: () => {} });
  }
}

function confirmPermanentDelete(record: TrashIndexEntry): void {
  showAlert({
    info: `永久删除“${record.label}”？此操作无法撤销。`,
    confirm: async () => {
      try {
        await runPendingAction(`trash-delete:${record.__key}`, async () => {
          await permanentlyDeleteTrashRecord(record.__key);
          await reload();
        });
      } catch (error) {
        console.error(error);
        showAlert({ info: "永久删除失败，回收记录仍被保留。", confirm: () => {} });
      }
    },
  });
}

function kindLabel(kind: TrashKind): string {
  const labels: Record<TrashKind, string> = {
    project: "项目",
    article: "文本",
    chapter: "章节",
    exitence: "事物",
    type: "分类",
    group: "分组",
  };
  return labels[kind];
}

function formatTime(time: number): string {
  return new Date(time).toLocaleString();
}
</script>

<style scoped lang="scss">
.recycleBin {
  height: 100%;
  overflow-y: auto;
  padding: 12px;
  box-sizing: border-box;
}

.empty {
  color: $previewText;
  padding: 28px 12px;
  text-align: center;
}

.featureEntries {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-bottom: 12px;
  border-bottom: 1px solid $bgColor70;
}

.record {
  min-height: 64px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid $bgColor70;
  padding: 10px 4px;
}

.recordInfo {
  min-width: 0;
  flex: 1;
}

.label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.meta {
  color: $previewText;
  font-size: 0.8rem;
  margin-top: 5px;
}

.actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.actions > .button {
  width: 34px;
  height: 34px;
}
</style>
