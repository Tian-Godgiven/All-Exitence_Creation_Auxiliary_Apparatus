<template>
    <FloatButton class="quickDraftFloat" :style="floatStyle" :if-long-tap="false" :click="toggle" :on-move="savePosition">
        <div v-if="!expanded" class="floatIcon"><Icon icon="quickDraft" name="快速记录灵感" /></div>
        <div v-else class="composer" @pointerdown.stop @pointerup.stop @click.stop>
            <TextArea v-model="content" mode="all" input-suggestion-list="all" placeholder="记录一个灵感..." />
            <div class="composerActions"><span class="colorMenuAnchor"><button class="colorButton" :style="{ background: selectedColorValue }" title="选择便签颜色" @click="showColorMenu = !showColorMenu"></button><div v-if="showColorMenu" ref="colorMenuRef" class="colorMenu"><button class="colorChoice none" :class="{ active: selectedColorKey === null }" @click="selectColor(null)">无色</button><button v-for="color in colors" :key="color.__key" class="colorChoice" :class="{ active: selectedColorKey === color.__key }" @click="selectColor(color.__key)"><span :style="{ background: color.value }"></span>{{ color.name || "未命名颜色" }}</button></div></span><span></span><Button icon="close" name="收起快捷输入" @click="fold" /><Button icon="check" name="完成并保存" @click="save" /></div>
        </div>
    </FloatButton>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from "vue"
import FloatButton from "@/components/floatWindow/floatButton.vue"
import Icon from "@/components/global/Icon.vue"
import Button from "@/components/global/button.vue"
import TextArea from "@/components/other/textArea/textArea.vue"
import { translateToTextContent } from "@/hooks/expression/textAreaContent"
import { showQuickInfo } from "@/api/showQuickInfo"
import { nowProjectPath } from "@/hooks/project/project"
import { appSetting, changeAppSetting } from "@/hooks/app/appSetting"
import { createQuickDraftNoteOnBoard, nowGlobalQuickDraftBoard, nowQuickDraftBoard, nowQuickDraftColors } from "./quickDraft"
import type { TextAreaContent } from "@/hooks/expression/textAreaContent"

const expanded = ref(false)
const content = ref<TextAreaContent[]>([""])
const selectedColorKey = ref<string | null>(nowQuickDraftColors[0]?.__key ?? null)
const selectedColorValue = computed(() => nowQuickDraftColors.find(color => color.__key === selectedColorKey.value)?.value ?? "transparent")
const colors = nowQuickDraftColors
const showColorMenu = ref(false)
const colorMenuRef = useTemplateRef("colorMenuRef")
const floatPosition = computed(() => Array.isArray(appSetting.quickDraftFloatPosition) && appSetting.quickDraftFloatPosition.length === 2 ? appSetting.quickDraftFloatPosition : null)
const floatStyle = computed(() => floatPosition.value
    ? { left: `${floatPosition.value[0]}px`, top: `${floatPosition.value[1]}px` }
    : { left: "calc(100% - 66px)", top: "calc(100% - 66px)" })
function toggle(){ expanded.value ? fold() : (expanded.value = true) }
function save(){
    if(!expanded.value) return
    if(translateToTextContent(content.value).trim()){
        const board = nowProjectPath.value ? nowQuickDraftBoard : nowGlobalQuickDraftBoard
        createQuickDraftNoteOnBoard(board, content.value, { x: 80 + board.notes.length * 20, y: 80 + board.notes.length * 20 }, selectedColorKey.value ?? undefined)
        showQuickInfo("已记录到便签夹中")
    }
    content.value = [""]
    expanded.value = false
}
function fold(){ expanded.value = false; showColorMenu.value = false }
function selectColor(colorKey: string | null){ selectedColorKey.value = colorKey; showColorMenu.value = false }
function closeColorMenuOnOutsidePointerDown(event: PointerEvent){
    const target = event.target
    if(!(target instanceof Element) || colorMenuRef.value?.contains(target) || target.closest(".colorButton")) return
    showColorMenu.value = false
}
function savePosition(state: "start" | "stop", dom: HTMLElement){
    if(state === "stop") void changeAppSetting("quickDraftFloatPosition", [dom.offsetLeft, dom.offsetTop])
}
onMounted(() => document.addEventListener("pointerdown", closeColorMenuOnOutsidePointerDown, true))
onBeforeUnmount(() => document.removeEventListener("pointerdown", closeColorMenuOnOutsidePointerDown, true))
</script>

<style scoped lang="scss">
.quickDraftFloat { position: fixed; z-index: 10; width: 48px; height: 48px; overflow: visible; border: 1px solid $antiBgColor; border-radius: 4px; background: $bgColor; box-shadow: 0 2px 8px $floatingSurfaceShadow; }
.floatIcon { display: grid; width: 100%; height: 100%; place-items: center; }.floatIcon .icon { width: 26px; height: 26px; }
.quickDraftFloat:has(.composer) { width: 280px; height: 150px; transform: translateX(-232px); }.composer { display: flex; height: 100%; flex-direction: column; padding: 10px; box-sizing: border-box; }.composer :deep(.textArea) { flex: 1; min-height: 0; overflow: auto; }.composerActions { display: grid; width: 100%; grid-template-columns: 32px 1fr 32px 32px; gap: 4px; }.composerActions .button, .colorButton { width: 32px; height: 32px; padding: 7px; border: 1px solid $bgColor70; border-radius: 3px; }.colorButton { cursor: pointer; }.colorMenuAnchor { position: relative; }.colorMenu { position: absolute; z-index: 2; bottom: calc(100% + 6px); left: 0; display: flex; width: max-content; min-width: 180px; flex-direction: column; gap: 3px; padding: 4px; border: 1px solid $bgColor70; border-radius: 3px; background: $bgColor; box-shadow: 2px 4px 10px $floatingSurfaceShadow; }.colorChoice { display: flex; min-height: 30px; align-items: center; gap: 7px; padding: 4px 7px; border: 1px solid transparent; border-radius: 2px; background: transparent; text-align: left; }.colorChoice:hover, .colorChoice.active { background: $bgColor90; }.colorChoice.active { border-color: $antiBgColor; }.colorChoice > span { width: 18px; height: 18px; border-radius: 2px; }.colorChoice.none { padding-left: 8px; }
@media (max-width: 899px) { .quickDraftFloat:has(.composer) { width: min(280px, calc(100vw - 20px)); transform: translateX(calc(-100% + 48px)); } }
</style>
