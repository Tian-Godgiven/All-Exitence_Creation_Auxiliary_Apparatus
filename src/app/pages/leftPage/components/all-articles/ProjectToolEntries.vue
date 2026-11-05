<template>
<template v-for="item in entries" :key="item.name">
    <div v-if="item.projectEntry.isVisible()" class="projectToolEntry" @click="item.projectEntry.click" @contextmenu.prevent="openMenu($event, item)">
        <Icon :icon="item.projectEntry.icon" /><span>{{ item.projectEntry.name }}</span>
    </div>
</template>
</template>

<script setup lang="ts">
import { computed } from "vue"
import Icon from "@/components/global/Icon.vue"
import { showControlPanel } from "@/hooks/controlPanel"
import { supportAbilityList, type SupportAbilitySignUpItem } from "@/static/list/supportAbilityList"

type ProjectEntryItem = SupportAbilitySignUpItem & { projectEntry: NonNullable<SupportAbilitySignUpItem["projectEntry"]> }
const entries = computed(() => supportAbilityList.filter((item): item is ProjectEntryItem => !!item.projectEntry))

function openMenu(event: MouseEvent, item: ProjectEntryItem){
    const entry = item.projectEntry
    if(!entry) return
    showControlPanel({ title: entry.name, option: [{ text: "从列表中移出", click: () => entry.setVisible(false) }] }, { x: event.clientX, y: event.clientY })
}
</script>

<style scoped lang="scss">
.projectToolEntry{display:flex;min-height:42px;align-items:center;gap:9px;padding:0 20px;border-bottom:1px solid $bgColor70;background:$bgColor90;box-sizing:border-box;font-weight:600;cursor:pointer}.projectToolEntry:hover{background:$focusingColor}.projectToolEntry .icon{width:18px;height:18px}@media(min-width:900px){.projectToolEntry{min-height:38px}}
</style>
