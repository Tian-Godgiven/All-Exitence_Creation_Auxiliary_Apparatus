<template>
    <div class="instanceEditor">
        <div class="preview"><TextStylePreview ref="previewRef" :snapshot="draft" /></div>
        <label v-if="draft.effect === 'fontWeight'">粗细<RangeValue v-model="draft.value" :min="100" :max="900" :step="100" /><span>{{ draft.value }}</span></label>
        <label v-else-if="draft.effect === 'color'">颜色<ElColorPicker v-model="draft.value" :teleported="false" /></label>
        <template v-else-if="draft.effect === 'shake'">
            <label>抖动幅度<RangeValue v-model="draft.value.strength" :min="0" :max="12" :step="0.5" /><span>{{ draft.value.strength }}</span></label>
            <label>抖动频率<RangeValue v-model="draft.value.frequency" :min="0.5" :max="15" :step="0.5" /><span>{{ draft.value.frequency }} Hz</span></label>
            <label>抖动规则度<RangeValue v-model="draft.value.regularity" :min="0" :max="100" :step="1" /><span>{{ draft.value.regularity }}%</span></label>
            <label>抖动方向<DirectionSelector v-model="draft.value.directions" multiple /></label>
            <label>所有文本同时抖动<input v-model="draft.value.synchronized" type="checkbox" /></label>
        </template>
        <template v-else-if="draft.effect === 'blur'">
            <label>模糊度<RangeValue v-model="draft.value.amount" :min="0" :max="6" :step="0.1" /><span>{{ draft.value.amount }}</span></label>
            <label>渐进模糊<input v-model="draft.value.progressive" type="checkbox" /></label>
            <template v-if="draft.value.progressive">
                <label>起点模糊度<RangeValue v-model="draft.value.startAmount" :min="0" :max="6" :step="0.1" /><span>{{ draft.value.startAmount }}</span></label>
                <label>模糊方向<DirectionSelector v-model="draft.value.direction" /></label>
                <label>渐进起点<RangeValue v-model="draft.value.center" :min="0" :max="100" :step="1" /><span>{{ draft.value.center }}%</span></label>
            </template>
        </template>
        <label v-else-if="draft.effect === 'offset'">错位幅度<RangeValue v-model="draft.value.amount" :min="0" :max="12" :step="0.5" /><span>{{ draft.value.amount }}</span></label>
        <template v-else-if="draft.effect === 'opacity'">
            <label>透明度<RangeValue v-model="draft.value.opacity" :min="0" :max="100" :step="1" /><span>{{ draft.value.opacity }}%</span></label>
            <label>渐进透明<input v-model="draft.value.progressive" type="checkbox" /></label>
            <template v-if="draft.value.progressive">
                <label>起点透明度<RangeValue v-model="draft.value.startOpacity" :min="0" :max="100" :step="1" /><span>{{ draft.value.startOpacity }}%</span></label>
                <label>透明方向<DirectionSelector v-model="draft.value.direction" /></label>
                <label>渐进起点<RangeValue v-model="draft.value.center" :min="0" :max="100" :step="1" /><span>{{ draft.value.center }}%</span></label>
            </template>
        </template>
        <label v-else-if="draft.effect === 'spoiler'">显示方式<Selector v-model="draft.value.reveal" :list="spoilerRevealOptions" /></label>
        <p v-else>斜体没有额外参数。</p>
        <Button v-if="draft.effect === 'offset'" icon="repeat" name="重新生成错位" @click="rerollOffset" />
        <Button icon="check" name="保存局部效果" @click="save" />
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { cloneDeep } from "lodash"
import { ElColorPicker } from "element-plus"
import Button from "@/components/global/button.vue"
import RangeValue from "@/components/all-exitence/status/valueType/range/rangeValue.vue"
import type { TextStyleSnapshot } from "@/hooks/expression/textAreaContent"
import { closePopUp } from "@/hooks/pages/popUp"
import TextStylePreview from "./TextStylePreview.vue"
import DirectionSelector from "./DirectionSelector.vue"
import Selector from "@/components/global/Selector.vue"

const spoilerRevealOptions = [{ label:"悬停显示",value:"hover" },{ label:"点击显示",value:"click" }]

const { props } = defineProps(["props"])
const { snapshot, saveSnapshot } = props as { snapshot: TextStyleSnapshot, saveSnapshot: (snapshot: TextStyleSnapshot)=>void }
const draft = ref<TextStyleSnapshot>(cloneDeep(snapshot))
const previewRef = ref<InstanceType<typeof TextStylePreview> | null>(null)
function save(){ saveSnapshot(cloneDeep(draft.value)); closePopUp() }
function rerollOffset(){ if(draft.value.effect === "offset")draft.value.value.seed = Math.random() * 100000 }
</script>

<style scoped lang="scss">
.instanceEditor { display:flex; min-width:360px; flex-direction:column; gap:14px; }.preview { overflow:hidden; padding:14px; border:1px solid $bgColor70; text-align:center; }.preview > span { display:inline-block; min-width:100%; }.instanceEditor label { display:flex; align-items:center; gap:10px; }.instanceEditor label :deep(.rangeValue) { flex:1; min-width:0; }.instanceEditor > .button { align-self:flex-end; width:32px; height:32px; padding:7px; }
</style>
