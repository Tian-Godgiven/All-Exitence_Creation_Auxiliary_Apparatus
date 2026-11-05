<template>
    <div class="textStyleMenu" ref="menuRef">
        <template v-if="styles.length">
            <div class="menuColumn">
                <div class="menuTitle">已有的效果</div>
                <button v-for="style in styles" :key="style.element" class="menuItem" :class="{ active: activeStyle === style }" @mouseenter="activeStyle = style">{{ style.data.snapshot.name }} · {{ style.data.scope === 'paragraph' ? '段落' : '文字' }}</button>
                <button class="menuItem" :class="{ active: activeStyle === null }" @mouseenter="activeStyle = null">添加效果</button>
            </div>
            <div class="menuColumn secondary">
                <template v-if="activeStyle">
                    <div class="menuTitle">{{ activeStyle.data.snapshot.name }}</div>
                    <button class="menuItem" @click="editStyle(activeStyle)">修改效果</button>
                    <button class="menuItem" @click="removeStyle(activeStyle)">移除效果</button>
                </template>
                <template v-else>
                <div class="menuTitle">选择要添加的效果</div>
                    <button v-for="material in materials" :key="material.__key" class="menuItem" :class="{ active: activeMaterial === material }" @mouseenter="activeMaterial = material" @click="applyMaterial(material)"><TextStylePreview :snapshot="material.snapshot" :text="material.name" /></button>
                </template>
            </div>
        </template>
        <template v-else>
            <div class="menuColumn">
                <div class="menuTitle">应用文字效果</div>
                <button v-for="material in materials" :key="material.__key" class="menuItem" :class="{ active: activeMaterial === material }" @mouseenter="activeMaterial = material" @click="applyMaterial(material)"><TextStylePreview :snapshot="material.snapshot" :text="material.name" /></button>
            </div>
        </template>
        <div v-if="activeMaterial && supportsScopeChoice(activeMaterial)" class="menuColumn secondary scopeColumn">
            <div class="menuTitle">作用范围</div>
            <button class="menuItem" @click="applyMaterial(activeMaterial,'text')">选中部分起效</button>
            <button class="menuItem" @click="applyMaterial(activeMaterial,'paragraph')">整个段落起效</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useTemplateRef } from "vue"
import type { TextStyleData } from "@/hooks/expression/textAreaContent"
import type { TextStyleMaterial } from "./textStyle"
import { nowTextStyleMaterials } from "./textStyle"
import { closePopUp } from "@/hooks/pages/popUp"
import TextStylePreview from "./TextStylePreview.vue"

export type TextStyleTarget = { element: HTMLElement, data: TextStyleData }
const { props, popUp } = defineProps(["props","popUp"])
const { styles, apply, edit, remove } = props as {
    styles: TextStyleTarget[],
    apply: (material: TextStyleMaterial,scope?: "text" | "paragraph")=>void,
    edit: (style: TextStyleTarget)=>void,
    remove: (style: TextStyleTarget)=>void,
}
const materials = nowTextStyleMaterials
const activeStyle = ref<TextStyleTarget | null>(styles[0] ?? null)
const activeMaterial = ref<TextStyleMaterial | null>(null)
const menuRef = useTemplateRef("menuRef")
onMounted(()=>document.addEventListener("pointerdown",closeOnOutside,true))
onBeforeUnmount(()=>document.removeEventListener("pointerdown",closeOnOutside,true))
function closeOnOutside(event: Event){ if(menuRef.value && !menuRef.value.contains(event.target as Node))closePopUp(popUp) }
function supportsScopeChoice(material:TextStyleMaterial){ return material.effect === "blur" || material.effect === "opacity" }
function applyMaterial(material: TextStyleMaterial,scope?: "text" | "paragraph"){
    if(supportsScopeChoice(material) && !scope)return
    apply(material,scope)
    closePopUp(popUp)
}
function editStyle(style: TextStyleTarget){ edit(style); closePopUp(popUp) }
function removeStyle(style: TextStyleTarget){ remove(style); closePopUp(popUp) }
</script>

<style scoped lang="scss">
.textStyleMenu { display:flex; min-width:300px; }.menuColumn { display:flex; min-width:150px; flex-direction:column; padding:4px; }.secondary { border-left:1px solid $bgColor70; }.menuTitle { padding:6px 8px; color:$previewText; font-size:.86rem; }.menuItem { padding:8px; border:0; background:transparent; color:$textColor; text-align:left; cursor:pointer; }.menuItem:hover,.menuItem.active { background:$bgColor90; }
</style>
