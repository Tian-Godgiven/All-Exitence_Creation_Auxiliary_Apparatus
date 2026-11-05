<template>
<div class="overviewEntry" @click="showProjectOverviewPage" @contextmenu.prevent="openMenu">
    <Icon icon="article" /><span>项目总览</span>
</div>
</template>
<script setup lang="ts">
import Icon from "@/components/global/Icon.vue"
import { showControlPanel } from "@/hooks/controlPanel"
import { hideProjectOverviewInLeft, showProjectOverviewPage } from "@/supportAbility/projectOverview/projectOverview"
function openMenu(event: MouseEvent){ showControlPanel({ title: "项目总览", option: [{ text: "从左侧移除", click: hideProjectOverviewInLeft }] }, { x: event.clientX, y: event.clientY }) }
</script>
<style scoped lang="scss">
.overviewEntry{display:flex;min-height:42px;align-items:center;gap:9px;padding:0 20px;border-bottom:1px solid $bgColor70;background:$bgColor90;box-sizing:border-box;font-weight:600;cursor:pointer}.overviewEntry:hover{background:$focusingColor}.overviewEntry .icon{width:18px;height:18px}@media(min-width:900px){.overviewEntry{min-height:38px}}
</style>
