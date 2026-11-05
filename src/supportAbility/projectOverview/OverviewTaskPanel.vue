<template>
<div ref="panelRef" class="taskPanel" @pointerdown.stop>
    <div class="taskPanelTitle"><span>任务</span><Button icon="add" name="添加任务" @click="addTask" /></div>
    <div v-for="task in tasks" :key="task.__key" class="task" :data-overview-task-key="task.__key" @contextmenu.prevent.stop="openTaskMenu($event, task.__key)">
        <DownLineInput v-model="task.text" placeholder="写作任务" />
        <ElCheckbox v-model="task.done" :aria-label="task.text || '完成任务'" />
    </div>
</div>
</template>
<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, useTemplateRef } from "vue"
import { ElCheckbox } from "element-plus"
import Button from "@/components/global/button.vue"
import DownLineInput from "@/components/other/input/downLineInput.vue"
import { showControlPanel } from "@/hooks/controlPanel"
import { createOverviewTask, type OverviewArticleNode, type OverviewChapterNode } from "./projectOverview"
const { node } = defineProps<{ node: OverviewChapterNode | OverviewArticleNode }>()
const emit = defineEmits<{ close: [] }>()
const tasks = node.tasks
const panelRef = useTemplateRef("panelRef")
function removeTask(key: string){ const index = tasks.findIndex(task => task.__key === key); if(index >= 0) tasks.splice(index, 1) }
async function addTask(){
    const task = createOverviewTask(node)
    await nextTick()
    panelRef.value?.querySelector<HTMLElement>(`[data-overview-task-key="${task.__key}"] input`)?.focus()
}
function openTaskMenu(event: MouseEvent, key: string){ showControlPanel({ option: [{ text: "删除任务", danger: true, click: () => removeTask(key) }] }, { x: event.clientX, y: event.clientY }) }
function closeOnOutside(event: PointerEvent){ if(event.target instanceof Node && !panelRef.value?.contains(event.target)) emit("close") }
onMounted(() => document.addEventListener("pointerdown", closeOnOutside, true))
onBeforeUnmount(() => document.removeEventListener("pointerdown", closeOnOutside, true))
</script>
<style scoped lang="scss">
.taskPanel{position:absolute;z-index:101;top:0;left:calc(100% + 8px);display:flex;width:260px;max-height:260px;flex-direction:column;gap:5px;padding:8px;border:1px solid $bgColor70;background:$bgColor;box-shadow:$menuShadow;overflow:auto;--el-color-primary:#{$bgColor40};--el-checkbox-bg-color:#{$bgColor};--el-checkbox-input-border-color:#{$inputBorderColor};--el-checkbox-checked-bg-color:#{$bgColor40};--el-checkbox-checked-input-border-color:#{$bgColor40}}.taskPanelTitle{display:flex;align-items:center;justify-content:space-between;font-weight:600}.taskPanelTitle .button{width:30px;height:30px}.task{display:flex;align-items:center;gap:6px}.task :deep(.downLineInput){min-width:0;flex:1}.task :deep(.el-checkbox){flex:0 0 auto;margin:0}.task :deep(.el-checkbox__inner){border-radius:3px}
</style>
