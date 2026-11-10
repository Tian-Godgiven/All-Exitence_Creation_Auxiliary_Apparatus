<template>
    <div class="nodeEditor">
        <label>节点类型<Selector v-model="form.kind" :list="kindOptions" /></label>
        <label v-if="form.kind === 'article'">选择文章<Selector v-model="form.targetKey" :list="articleOptions" /></label>
        <label v-else>卡片标题<DownLineInput v-model="form.label" placeholder="输入卡片标题" /></label>
        <label v-if="form.kind === 'card'" class="contentLabel">卡片内容<TextArea v-model="form.content" mode="all" placeholder="可选的卡片正文" /></label>
        <label>开始时间<DownLineInput v-model.number="form.start" type="number" /></label>
        <label class="rangeToggle"><input v-model="form.hasEnd" type="checkbox">创建时间范围</label>
        <label v-if="form.hasEnd">结束时间<DownLineInput v-model.number="form.end" type="number" /></label>
        <div class="actions"><Button icon="check" :name="props.props.node ? '保存节点' : '创建节点'" @click="save" /></div>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue"
import { cloneDeep } from "lodash"
import Button from "@/components/global/button.vue"
import Selector from "@/components/global/Selector.vue"
import DownLineInput from "@/components/other/input/downLineInput.vue"
import TextArea from "@/components/other/textArea/textArea.vue"
import { nowAllArticles } from "@/hooks/all-articles/allArticles"
import { closePopUp, type PopUp } from "@/hooks/pages/popUp"
import type { TimeLineNode } from "./timeLine"

const props = defineProps<{
    popUp: PopUp,
    props: { start: number, offsetY: number, minTime: number, maxTime: number, node?: TimeLineNode },
    returnValue?: (value: Pick<TimeLineNode, "kind" | "label" | "start" | "offsetY" | "end" | "target" | "content">) => void,
}>()
const kindOptions = [
    { label: "文章节点（双击跳转）", value: "article" },
    { label: "内容卡片（点击展开）", value: "card" },
]
const articleOptions = computed(() => {
    const articles: { value: string, label: string }[] = []
    const collect = (parent: typeof nowAllArticles, path: string[]) => {
        parent.chapters.forEach((chapter) => {
            const name = chapter.name || "未命名章节"
            collect(chapter, [...path, name])
        })
        parent.articles.forEach((article) => articles.push({
            value: article.__key,
            label: [...path, article.title || "未命名文章"].join(" / "),
        }))
    }
    collect(nowAllArticles, [])
    return articles
})
const form = reactive({
    kind: (props.props.node?.kind ?? (props.props.node?.target ? "article" : "card")) as "article" | "card",
    label: props.props.node?.label ?? "新卡片",
    content: cloneDeep(props.props.node?.content ?? []),
    targetKey: props.props.node?.target?.key ?? "",
    start: props.props.node?.start ?? props.props.start,
    offsetY: props.props.node?.offsetY ?? props.props.offsetY,
    end: props.props.node?.end ?? props.props.start,
    hasEnd: props.props.node?.end != null,
})

function save(){
    if(form.kind === "article" && !form.targetKey) return
    const article = articleOptions.value.find((item) => item.value === form.targetKey)
    const start = Math.max(props.props.minTime, Math.min(props.props.maxTime, Number.isFinite(form.start) ? form.start : props.props.start))
    props.returnValue?.({
        kind: form.kind,
        label: form.kind === "article" ? article?.label.split(" / ").at(-1) ?? "未命名文章" : form.label.trim() || "新卡片",
        start,
        offsetY: form.offsetY,
        end: form.hasEnd ? Math.max(start, Math.min(props.props.maxTime, Number.isFinite(form.end) ? form.end : start)) : undefined,
        target: form.kind === "article" ? { type: "article", key: form.targetKey } : undefined,
        content: form.kind === "card" ? form.content : undefined,
    })
    closePopUp(props.popUp)
}
</script>

<style scoped lang="scss">
.nodeEditor {
    display: flex;
    width: min(480px, 82vw);
    flex-direction: column;
    gap: 12px;
}

.nodeEditor label {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.nodeEditor .rangeToggle {
    flex-direction: row;
    align-items: center;
}

.contentLabel :deep(.textArea) {
    min-height: 160px;
    max-height: 45vh;
    overflow: auto;
}

.actions {
    display: flex;
    justify-content: flex-end;
}
</style>
