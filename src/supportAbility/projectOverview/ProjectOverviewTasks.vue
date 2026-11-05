<template>
<aside v-if="nodes.length" class="overviewTasks">
    <div class="taskTitle">本章写作目标</div>
    <template v-for="node in nodes" :key="node.__key">
        <div v-if="nodes.length > 1" class="nodeTitle">{{ node.title || "未命名文章" }}</div>
        <label v-for="task in node.tasks" :key="task.__key"><input v-model="task.done" type="checkbox"><span :class="{done: task.done}">{{ task.text || "未命名任务" }}</span></label>
    </template>
</aside>
</template>
<script setup lang="ts">
import { computed } from "vue"
import type { Article } from "@/class/Article"
import { nowProjectOverview } from "./projectOverview"
const { article } = defineProps<{ article: Article }>()
const nodes = computed(() => nowProjectOverview.articles.filter(node => node.targetKey === article.__key && node.tasks.length))
</script>
<style scoped lang="scss">
.overviewTasks{position:fixed;right:22px;bottom:22px;z-index:4;display:flex;width:min(280px,calc(100vw - 44px));max-height:38vh;flex-direction:column;gap:6px;padding:10px;border:1px solid $bgColor70;background:$bgColor;box-shadow:$menuShadow;overflow:auto}.taskTitle{font-weight:600}.nodeTitle{color:$previewText;font-size:.9em}.overviewTasks label{display:flex;align-items:flex-start;gap:7px;cursor:pointer}.overviewTasks input{margin-top:3px}.done{text-decoration:line-through;color:$previewText}@media(max-width:899px){.overviewTasks{right:12px;bottom:12px;width:min(280px,calc(100vw - 24px))}}
</style>
