<template>
    <div class="timeLineTrash">
        <div v-if="records.length === 0" class="empty">时间线回收站为空</div>
        <div v-for="record in records" :key="record.__key" class="record">
            <div class="recordInfo">
                <div class="label">{{ record.timeLine.name }}</div>
                <div class="meta">删除于 {{ new Date(record.deletedAt).toLocaleString() }}</div>
            </div>
            <div class="actions">
                <Button icon="backMain" name="恢复时间线" @click="restore(record)" />
                <Button icon="delete" name="永久删除时间线" @click="confirmPermanentDelete(record)" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Button from "@/components/global/button.vue"
import { showAlert } from "@/hooks/alert"
import { nowTimeLineTrash, permanentlyDeleteStoryTimeLine, restoreStoryTimeLineFromTrash } from "./timeLine"
import type { TimeLineTrashRecord } from "./timeLine"

const records = nowTimeLineTrash

async function restore(record: TimeLineTrashRecord){
    await restoreStoryTimeLineFromTrash(record)
}

function confirmPermanentDelete(record: TimeLineTrashRecord){
    showAlert({
        info: `永久删除时间线“${record.timeLine.name}”？此操作无法撤销。`,
        confirm: async () => {
            await permanentlyDeleteStoryTimeLine(record)
        },
    })
}
</script>

<style scoped lang="scss">
.timeLineTrash {
    height: 100%;
    padding: 12px;
    box-sizing: border-box;
    overflow: auto;
}

.empty {
    padding: 28px 12px;
    color: $previewText;
    text-align: center;
}

.record {
    display: flex;
    min-height: 64px;
    align-items: center;
    gap: 12px;
    padding: 10px 4px;
    border-bottom: 1px solid $bgColor70;
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
    margin-top: 5px;
    color: $previewText;
    font-size: 0.8rem;
}

.actions {
    display: flex;
    flex: 0 0 auto;
    gap: 8px;
}

.actions > .button {
    width: 34px;
    height: 34px;
}
</style>
