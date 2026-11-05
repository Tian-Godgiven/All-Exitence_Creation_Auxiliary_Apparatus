<template>
    <Selector v-model="state.format" :list="formatOptions" />
</template>

<script setup lang="ts">
import Selector from "@/components/global/Selector.vue"
import type { ExportFormat } from "./projectExport"

const { props } = defineProps<{ props: { state: { format: ExportFormat } } }>()
const state = props.state
const formatOptions:{ value: ExportFormat, label: string }[] = [
    { value: "text", label: "纯文本" },
    { value: "ao3", label: "AO3 发布" },
    { value: "epub", label: "EPUB" },
]
</script>

<style scoped lang="scss">
:deep(.el-select) { width: 128px; }
</style>
