<template>
    <div class="nodeEditor">
        <label>事件名称<DownLineInput v-model="form.label" placeholder="输入事件名称" /></label>
        <label>关联对象类型<Selector v-model="form.targetType" :list="targetTypeOptions" /></label>
        <label v-if="form.targetType !== 'event'">选择对象<Selector v-model="form.targetKey" :list="targetOptions" /></label>
        <label>开始时间<DownLineInput v-model.number="form.start" type="number" /></label>
        <label class="rangeToggle"><input v-model="form.hasEnd" type="checkbox">创建时间范围</label>
        <label v-if="form.hasEnd">结束时间<DownLineInput v-model.number="form.end" type="number" /></label>
        <div class="actions"><Button icon="check" name="创建事件" @click="save" /></div>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from "vue"
import Button from "@/components/global/button.vue"
import Selector from "@/components/global/Selector.vue"
import DownLineInput from "@/components/other/input/downLineInput.vue"
import { nowAllArticles } from "@/hooks/all-articles/allArticles"
import { closePopUp, type PopUp } from "@/hooks/pages/popUp"
import type { TimeLineNode } from "./timeLine"

const { popUp, props, returnValue } = defineProps<{
    popUp: PopUp,
    props: { start: number, offsetY: number },
    returnValue?: (value: Pick<TimeLineNode, "label" | "start" | "offsetY" | "end" | "target">) => void,
}>()
type TargetType = "event" | "chapter" | "article"
const form = reactive({
    label: "新事件",
    start: props.start,
    offsetY: props.offsetY,
    end: props.start,
    hasEnd: false,
    targetType: "event" as TargetType,
    targetKey: "",
})
const targetTypeOptions = [
    { label: "自由事件", value: "event" },
    { label: "章节", value: "chapter" },
    { label: "文章", value: "article" },
]
const targets = computed(() => {
    const result: { type: "chapter" | "article", key: string, label: string }[] = []
    const collect = (parent: typeof nowAllArticles, path: string[]) => {
        parent.chapters.forEach((chapter) => {
            const name = chapter.name || "未命名章节"
            const nextPath = [...path, name]
            result.push({ type: "chapter", key: chapter.__key, label: nextPath.join(" / ") })
            collect(chapter, nextPath)
        })
        parent.articles.forEach((article) => result.push({ type: "article", key: article.__key, label: [...path, article.title || "未命名文章"].join(" / ") }))
    }
    collect(nowAllArticles, [])
    return result
})
const targetOptions = computed(() => targets.value.filter((target) => target.type === form.targetType).map(({ key, label }) => ({ value: key, label })))
watch(() => form.targetType, () => { form.targetKey = "" })

function save(){
    const target = form.targetType === "event" || !form.targetKey
        ? undefined
        : { type: form.targetType, key: form.targetKey }
    returnValue?.({
        label: form.label.trim() || "新事件",
        start: Math.max(0, form.start || 0),
        offsetY: form.offsetY,
        ...(form.hasEnd ? { end: Math.max(form.start || 0, form.end || 0) } : {}),
        ...(target ? { target } : {}),
    })
    closePopUp(popUp)
}
</script>

<style scoped lang="scss">
.nodeEditor {
    display: flex;
    width: min(420px, 82vw);
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

.actions {
    display: flex;
    justify-content: flex-end;
}
</style>
