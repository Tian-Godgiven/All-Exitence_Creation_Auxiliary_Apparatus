<template>
    <div class="colorManager">
        <div v-for="color in colors" :key="color.__key" class="colorRow">
            <ElColorPicker v-model="color.value" />
            <DownLineInput v-model="color.name" placeholder="颜色名称" />
            <Button icon="delete" name="删除颜色" @click="removeColor(color)" />
        </div>
        <Button icon="add" name="添加颜色" @click="addColor" />
    </div>
</template>

<script setup lang="ts">
import { nanoid } from "nanoid"
import { ElColorPicker } from "element-plus"
import Button from "@/components/global/button.vue"
import DownLineInput from "@/components/other/input/downLineInput.vue"
import { showAlert } from "@/hooks/alert"
import { nowQuickDraftColors } from "./quickDraft"
import type { QuickDraftColor } from "./quickDraft"

const colors = nowQuickDraftColors
function addColor(){ colors.push({ __key: nanoid(), name: "新颜色", value: "#8aa1a1" }) }
function removeColor(color: QuickDraftColor){
    showAlert({ info: `删除颜色“${color.name || "未命名颜色"}”？使用它的便签会显示为无色。`, confirm: () => {
        const index = colors.indexOf(color)
        if(index >= 0) colors.splice(index, 1)
    }})
}
</script>

<style scoped lang="scss">
.colorManager { display: flex; min-width: 320px; flex-direction: column; gap: 10px; }.colorRow { display: flex; align-items: center; gap: 10px; }.colorRow .downLineInput { flex: 1; }.colorRow .button, .colorManager > .button { width: 32px; height: 32px; padding: 7px; }
</style>
