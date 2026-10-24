<template>
    <form class="segmentEditor" @submit.prevent="save">
        <label>
            片段名称
            <DownLineInput v-model="form.name" placeholder="输入片段名称" />
        </label>
        <label>
            时间规则
            <Selector v-model="form.timeRuleKey" :list="timeRuleOptions" @change="resetUnit" />
        </label>
        <label>
            时间单位
            <Selector v-model="form.unit" :list="unitOptions" />
        </label>
        <label>
            片段长度
            <DownLineInput v-model.number="form.length" type="number" placeholder="输入片段长度" />
        </label>
        <label>
            每单位宽度（px）
            <DownLineInput v-model.number="form.unitWidth" type="number" placeholder="最小 8 px" />
        </label>
        <div class="actions">
            <Button icon="check" name="保存" @click="save" />
        </div>
    </form>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue"
import Button from "@/components/global/button.vue"
import Selector from "@/components/global/Selector.vue"
import DownLineInput from "@/components/other/input/downLineInput.vue"
import { closePopUp, PopUp } from "@/hooks/pages/popUp"
import { customTimeLib } from "@/supportAbility/customTime/customTime"
import { getTimeRule, getTimeRuleUnits } from "@/supportAbility/customTime/translateTime"
import type { TimeLineSegment } from "./timeLine"

const { popUp, props, returnValue } = defineProps<{
    popUp: PopUp,
    props: { segment: Partial<TimeLineSegment> },
    returnValue?: (value: Pick<TimeLineSegment, "name" | "timeRuleKey" | "unit" | "length" | "unitWidth">) => void,
}>()
const form = reactive({
    name: props.segment.name ?? "新时间片段",
    timeRuleKey: props.segment.timeRuleKey ?? "date",
    unit: props.segment.unit ?? "日",
    length: props.segment.length ?? 50,
    unitWidth: props.segment.unitWidth ?? 24,
})
const units = computed(() => {
    const rule = getTimeRule(form.timeRuleKey)
    return rule ? getTimeRuleUnits(rule).map((unit) => typeof unit === "string" ? unit : unit.name) : []
})
const timeRuleOptions = computed(() => [
    { label: "公历", value: "date" },
    ...customTimeLib.map((rule) => ({ label: rule.name, value: rule.__key })),
])
const unitOptions = computed(() => units.value.map((unit) => ({ label: unit, value: unit })))

function resetUnit(){
    form.unit = units.value[0] ?? "日"
}

function save(){
    returnValue?.({ ...form, length: Math.max(1, form.length), unitWidth: Math.max(8, form.unitWidth) })
    closePopUp(popUp)
}
</script>

<style scoped lang="scss">
.segmentEditor {
    display: flex;
    width: min(420px, 82vw);
    flex-direction: column;
    gap: 12px;
}

.segmentEditor label {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.segmentEditor :deep(.downLineInput),
.segmentEditor :deep(.el-select) {
    box-sizing: border-box;
    width: 100%;
}

.actions {
    display: flex;
    justify-content: flex-end;
}
</style>
