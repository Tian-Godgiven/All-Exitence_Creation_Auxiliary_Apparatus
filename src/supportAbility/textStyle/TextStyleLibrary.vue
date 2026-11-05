<template>
    <div class="textStyleLibrary">
        <aside class="materialList">
            <button v-for="material in materials" :key="material.__key" class="materialItem" :class="{ active: material.__key === selectedKey }" @click="selectMaterial(material)">
                <TextStylePreview :snapshot="material.snapshot" text="效果预览" />
                <small>{{ material.name }}</small>
            </button>
        </aside>
        <section v-if="draft" class="editor">
            <div class="preview"><TextStylePreview ref="previewRef" :snapshot="draft.snapshot" /></div>
            <label v-if="draft.effect === 'fontWeight'">粗细<RangeValue v-model="draft.snapshot.value" :min="100" :max="900" :step="100" /><span>{{ draft.snapshot.value }}</span></label>
            <label v-else-if="draft.effect === 'color'">默认颜色<ElColorPicker v-model="draft.snapshot.value" :teleported="false" /></label>
            <template v-else-if="draft.effect === 'shake'">
                <label>抖动幅度<RangeValue v-model="draft.snapshot.value.strength" :min="0" :max="12" :step="0.5" /><span>{{ draft.snapshot.value.strength }}</span></label>
                <label>抖动频率<RangeValue v-model="draft.snapshot.value.frequency" :min="0.5" :max="15" :step="0.5" /><span>{{ draft.snapshot.value.frequency }} Hz</span></label>
                <label>抖动规则度<RangeValue v-model="draft.snapshot.value.regularity" :min="0" :max="100" :step="1" /><span>{{ draft.snapshot.value.regularity }}%</span></label>
                <label>抖动方向<DirectionSelector v-model="draft.snapshot.value.directions" multiple /></label>
                <label>所有文本同时抖动<input v-model="draft.snapshot.value.synchronized" type="checkbox" /></label>
            </template>
            <template v-else-if="draft.effect === 'blur'">
                <label>模糊度<RangeValue v-model="draft.snapshot.value.amount" :min="0" :max="6" :step="0.1" /><span>{{ draft.snapshot.value.amount }}</span></label>
                <label>渐进模糊<input v-model="draft.snapshot.value.progressive" type="checkbox" /></label>
                <template v-if="draft.snapshot.value.progressive">
                    <label>起点模糊度<RangeValue v-model="draft.snapshot.value.startAmount" :min="0" :max="6" :step="0.1" /><span>{{ draft.snapshot.value.startAmount }}</span></label>
                    <label>模糊方向<DirectionSelector v-model="draft.snapshot.value.direction" /></label>
                    <label>渐进起点<RangeValue v-model="draft.snapshot.value.center" :min="0" :max="100" :step="1" /><span>{{ draft.snapshot.value.center }}%</span></label>
                </template>
            </template>
            <label v-else-if="draft.effect === 'offset'">错位幅度<RangeValue v-model="draft.snapshot.value.amount" :min="0" :max="12" :step="0.5" /><span>{{ draft.snapshot.value.amount }}</span></label>
            <template v-else-if="draft.effect === 'opacity'">
                <label>透明度<RangeValue v-model="draft.snapshot.value.opacity" :min="0" :max="100" :step="1" /><span>{{ draft.snapshot.value.opacity }}%</span></label>
                <label>渐进透明<input v-model="draft.snapshot.value.progressive" type="checkbox" /></label>
                <template v-if="draft.snapshot.value.progressive">
                    <label>起点透明度<RangeValue v-model="draft.snapshot.value.startOpacity" :min="0" :max="100" :step="1" /><span>{{ draft.snapshot.value.startOpacity }}%</span></label>
                    <label>透明方向<DirectionSelector v-model="draft.snapshot.value.direction" /></label>
                    <label>渐进起点<RangeValue v-model="draft.snapshot.value.center" :min="0" :max="100" :step="1" /><span>{{ draft.snapshot.value.center }}%</span></label>
                </template>
            </template>
            <label v-else-if="draft.effect === 'spoiler'">显示方式<Selector v-model="draft.snapshot.value.reveal" :list="spoilerRevealOptions" /></label>
            <p v-else class="noOptions">斜体没有额外参数。</p>
            <Button v-if="draft.effect === 'offset'" icon="repeat" name="重新生成错位" @click="rerollOffset" />
            <label v-if="usageCount > 0" class="syncOption"><input v-model="syncExisting" type="checkbox" /> 同步更新当前项目中使用此素材的 {{ usageCount }} 处效果</label>
            <div class="actions"><Button icon="check" name="保存效果" @click="saveMaterial" /></div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { cloneDeep } from "lodash"
import { ElColorPicker } from "element-plus"
import { showAlert } from "@/hooks/alert"
import { countMaterialUsage, nowTextStyleMaterials, saveTextStyleMaterials, syncMaterialInCurrentProject } from "./textStyle"
import type { TextStyleMaterial } from "./textStyle"
import Button from "@/components/global/button.vue"
import RangeValue from "@/components/all-exitence/status/valueType/range/rangeValue.vue"
import TextStylePreview from "./TextStylePreview.vue"
import DirectionSelector from "./DirectionSelector.vue"
import Selector from "@/components/global/Selector.vue"

const spoilerRevealOptions = [{ label:"悬停显示",value:"hover" },{ label:"点击显示",value:"click" }]

const materials = nowTextStyleMaterials
const previewRef = ref<InstanceType<typeof TextStylePreview> | null>(null)
const selectedKey = ref(materials[0]?.__key ?? "")
const draft = ref<TextStyleMaterial | null>(materials[0] ? cloneDeep(materials[0]) : null)
const syncExisting = ref(false)
const usageCount = computed(()=>draft.value ? countMaterialUsage(draft.value.__key) : 0)

function selectMaterial(material: TextStyleMaterial){ selectedKey.value = material.__key; draft.value = cloneDeep(material); syncExisting.value = false }
function rerollOffset(){ if(draft.value?.effect === "offset")draft.value.snapshot.value.seed = Math.random() * 100000 }
function saveMaterial(){
    if(!draft.value)return
    const next = cloneDeep(draft.value)
    const material = materials.find(item=>item.__key === next.__key)
    if(!material)return
    const save = ()=>{
        Object.assign(material,next,{ snapshot: { ...next.snapshot, name: next.name } })
        if(syncExisting.value) syncMaterialInCurrentProject(material)
        void saveTextStyleMaterials()
        syncExisting.value = false
    }
    if(syncExisting.value && usageCount.value > 0){
        showAlert({ info:`同步更新当前项目中使用“${next.name}”的 ${usageCount.value} 处效果？已在文章内单独修改的效果不会被覆盖。`, confirm:save })
        return
    }
    save()
}
</script>

<style scoped lang="scss">
.textStyleLibrary { display:grid; min-height:420px; grid-template-columns:190px minmax(280px,1fr); gap:18px; padding:16px; }.materialList { display:flex; flex-direction:column; gap:6px; overflow:auto; }.materialItem { display:flex; min-height:58px; flex-direction:column; justify-content:center; gap:3px; padding:8px; border:0; border-radius:4px; background:transparent; color:$textColor; text-align:left; cursor:pointer; }.materialItem:hover,.materialItem.active { background:$bgColor90; }.materialItem small { color:$previewText; }.editor { display:flex; flex-direction:column; gap:14px; max-width:420px; }.preview { overflow:hidden; padding:20px; border:1px solid $bgColor70; text-align:center; }.preview > :deep(.textStylePreview) { display:inline-block; min-width:100%; }.editor label { display:flex; align-items:center; gap:10px; }.editor label :deep(.rangeValue) { flex:1; min-width:0; }.noOptions { color:$previewText; }.syncOption { align-items:flex-start!important; color:$previewText; }.actions { display:flex; gap:8px; }.actions .button { width:32px; height:32px; padding:7px; } @media (max-width:899px){ .textStyleLibrary { grid-template-columns:1fr; }.materialList { max-height:150px; } }
</style>
