<template>
    <form class="segmentEditor" @submit.prevent="save">
        <label>
            片段名称
            <DownLineInput v-model="form.name" placeholder="输入片段名称" />
        </label>
        <label class="originToggle"><input v-model="form.hasAxisOrigin" type="checkbox">设置绝对起始时间点</label>
        <label v-if="form.hasAxisOrigin">
            历法名称
            <DownLineInput v-model="form.calendarName" placeholder="例如：公历、曙光历" />
        </label>
        <fieldset v-if="form.hasAxisOrigin" class="axisOrigin">
            <legend>起始时间点</legend>
            <label>年<DownLineInput v-model.number="form.originYear" type="number" /></label>
            <label>月<DownLineInput v-model.number="form.originMonth" type="number" /></label>
            <label>日<DownLineInput v-model.number="form.originDay" type="number" /></label>
        </fieldset>
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
import { reactive } from "vue"
import Button from "@/components/global/button.vue"
import Selector from "@/components/global/Selector.vue"
import DownLineInput from "@/components/other/input/downLineInput.vue"
import { closePopUp, PopUp } from "@/hooks/pages/popUp"
import { showAlert } from "@/hooks/alert"
import type { TimeLineSegment } from "./timeLine"

const { popUp, props, returnValue } = defineProps<{
    popUp: PopUp,
    props: { segment: Partial<TimeLineSegment> },
    returnValue?: (value: Pick<TimeLineSegment, "name" | "timeRuleKey" | "unit" | "length" | "unitWidth" | "calendarName" | "axisOrigin">) => void,
}>()
const form = reactive({
    name: props.segment.name ?? "新时间片段",
    unit: props.segment.unit ?? "日",
    hasAxisOrigin: props.segment.axisOrigin != null || !props.segment.__key,
    calendarName: props.segment.calendarName ?? "公历",
    originYear: props.segment.axisOrigin?.year ?? new Date().getFullYear(),
    originMonth: props.segment.axisOrigin?.month ?? new Date().getMonth() + 1,
    originDay: props.segment.axisOrigin?.day ?? new Date().getDate(),
    length: props.segment.length ?? 50,
    unitWidth: props.segment.unitWidth ?? 24,
})
const unitOptions = ["年", "月", "日"].map((unit) => ({ label: unit, value: unit }))

function save(){
    let axisOrigin: TimeLineSegment["axisOrigin"]
    if(form.hasAxisOrigin){
        const year = Math.trunc(Number(form.originYear))
        const month = Math.trunc(Number(form.originMonth))
        const day = Math.trunc(Number(form.originDay))
        const monthEnd = new Date(0)
        monthEnd.setHours(12, 0, 0, 0)
        monthEnd.setFullYear(year, month, 0)
        if(!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day) || month < 1 || month > 12 || day < 1 || day > monthEnd.getDate()){
            showAlert({ info: "请输入有效的起始年月日。", confirm: () => {} })
            return
        }
        axisOrigin = { year, month, day }
    }
    returnValue?.({
        name: form.name,
        timeRuleKey: "date",
        unit: form.unit,
        length: Math.max(1, form.length),
        unitWidth: Math.max(8, form.unitWidth),
        calendarName: form.hasAxisOrigin ? form.calendarName.trim() : undefined,
        axisOrigin,
    })
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

.axisOrigin {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
    padding: 8px;
    border: 1px solid $bgColor70;
}

.originToggle {
    flex-direction: row !important;
    align-items: center;
}

.axisOrigin label {
    min-width: 0;
}
</style>
