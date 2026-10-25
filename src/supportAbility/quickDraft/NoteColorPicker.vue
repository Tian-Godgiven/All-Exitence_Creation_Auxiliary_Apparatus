<template>
    <div class="noteColorPicker">
        <button class="colorChoice none" :class="{ active: selectedColorKey === null }" @click="select(null)">无色</button>
        <button v-for="color in colors" :key="color.__key" class="colorChoice" :class="{ active: selectedColorKey === color.__key }" :title="color.name || '未命名颜色'" @click="select(color.__key)"><span :style="{ background: color.value }"></span>{{ color.name || "未命名颜色" }}</button>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { closePopUp, type PopUp } from "@/hooks/pages/popUp"
import { nowQuickDraftColors } from "./quickDraft"
import type { QuickDraftNote } from "./quickDraft"

const { props, popUp, returnValue } = defineProps<{ props: { note?: QuickDraftNote, colorKey?: string | null }, popUp: PopUp, returnValue?: (colorKey: string | null) => void }>()
const note = props.note
const colors = nowQuickDraftColors
const selectedColorKey = computed(() => note?.colorKey ?? props.colorKey ?? null)
function select(colorKey: string | null){
    if(note) note.colorKey = colorKey
    returnValue?.(colorKey)
    closePopUp(popUp)
}
</script>

<style scoped lang="scss">
.noteColorPicker { display: flex; min-width: 200px; flex-direction: column; gap: 5px; }.colorChoice { display: flex; width: 100%; min-height: 32px; align-items: center; gap: 8px; padding: 5px 8px; border: 2px solid transparent; border-radius: 3px; background: transparent; text-align: left; }.colorChoice > span { width: 20px; height: 20px; flex: 0 0 auto; border-radius: 2px; }.colorChoice.active { border-color: $antiBgColor; }.colorChoice.none { border-color: $bgColor70; }.colorChoice.none.active { border-color: $antiBgColor; }
</style>
