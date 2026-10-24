<template>
    <div class="connectionEditor">
        <label>关系类型<Selector v-model="form.type" :list="typeOptions" /></label>
        <label>起始片段端点<Selector v-model="form.fromAnchor" :list="anchorOptions" /></label>
        <label>目标片段端点<Selector v-model="form.toAnchor" :list="anchorOptions" /></label>
        <label v-if="form.type === 'after'" class="gapToggle"><input v-model="form.hasGap" type="checkbox">设置时间间隔</label>
        <template v-if="form.type === 'after' && form.hasGap">
            <label>间隔数值<DownLineInput v-model.number="form.gapValue" type="number" /></label>
            <label>间隔单位<DownLineInput v-model="form.gapUnit" placeholder="例如：日" /></label>
        </template>
        <div class="actions"><Button icon="check" :name="connection ? '保存关系' : '创建关系'" @click="save" /></div>
    </div>
</template>

<script setup lang="ts">
import { reactive } from "vue"
import Button from "@/components/global/button.vue"
import Selector from "@/components/global/Selector.vue"
import DownLineInput from "@/components/other/input/downLineInput.vue"
import { closePopUp, type PopUp } from "@/hooks/pages/popUp"
import type { TimeLineConnection } from "./timeLine"

const { popUp, props, returnValue } = defineProps<{
    popUp: PopUp,
    props?: { connection?: TimeLineConnection },
    returnValue?: (value: Pick<TimeLineConnection, "type" | "fromAnchor" | "toAnchor" | "gap">) => void,
}>()
const connection = props?.connection
const form = reactive({
    type: (connection?.type ?? "after") as TimeLineConnection["type"],
    fromAnchor: (connection?.fromAnchor ?? "end") as "start" | "end",
    toAnchor: (connection?.toAnchor ?? "start") as "start" | "end",
    hasGap: !!connection?.gap,
    gapValue: connection?.gap?.value ?? 1,
    gapUnit: connection?.gap?.unit ?? "日",
})
const typeOptions = [
    { label: "之后", value: "after" },
    { label: "同时", value: "parallel" },
]
const anchorOptions = [
    { label: "首端", value: "start" },
    { label: "尾端", value: "end" },
]

function save(){
    returnValue?.({
        type: form.type,
        fromAnchor: form.fromAnchor,
        toAnchor: form.toAnchor,
        gap: form.type === "after" && form.hasGap
            ? { value: Math.max(0, form.gapValue || 0), unit: form.gapUnit || "日", timeRuleKey: connection?.gap?.timeRuleKey ?? "date" }
            : undefined,
    })
    closePopUp(popUp)
}
</script>

<style scoped lang="scss">
.connectionEditor {
    display: flex;
    width: min(420px, 82vw);
    flex-direction: column;
    gap: 12px;
}

.connectionEditor label {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.connectionEditor .gapToggle {
    flex-direction: row;
    align-items: center;
}

.actions {
    display: flex;
    justify-content: flex-end;
}
</style>
