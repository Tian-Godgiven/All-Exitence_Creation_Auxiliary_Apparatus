<template>
    <div class="directionSelector" :class="{ multiple }">
        <button v-for="direction in textStyleDirections" :key="direction.value" class="direction" :class="{ active: isSelected(direction.value) }" :title="direction.label" @click="select(direction.value)">{{ direction.short }}</button>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { textStyleDirections, type TextStyleDirection } from "@/hooks/expression/textAreaContent"

const { multiple = false } = defineProps<{ multiple?: boolean }>()
const model = defineModel<TextStyleDirection | TextStyleDirection[]>()
const selected = computed<TextStyleDirection[]>(()=>Array.isArray(model.value) ? model.value : model.value ? [model.value] : [])
function isSelected(direction: TextStyleDirection){ return selected.value.includes(direction) }
function select(direction: TextStyleDirection){
    if(!multiple){ model.value = direction; return }
    const current = selected.value
    if(current.includes(direction)){
        if(current.length > 1)model.value = current.filter(item=>item !== direction)
    }
    else model.value = [...current,direction]
}
</script>

<style scoped lang="scss">
.directionSelector { display:grid; width:96px; grid-template-columns:repeat(3, 1fr); gap:2px; }.direction { height:28px; padding:0; border:1px solid $bgColor70; border-radius:3px; background:$bgColor; color:$previewText; font:inherit; font-size:.75rem; cursor:pointer; }.direction:hover,.direction.active { border-color:$antiBgColor; color:$textColor; background:$bgColor90; }.direction:nth-child(1){ grid-column:2; }.direction:nth-child(2){ grid-column:3; grid-row:1; }.direction:nth-child(3){ grid-column:3; grid-row:2; }.direction:nth-child(4){ grid-column:3; grid-row:3; }.direction:nth-child(5){ grid-column:2; grid-row:3; }.direction:nth-child(6){ grid-column:1; grid-row:3; }.direction:nth-child(7){ grid-column:1; grid-row:2; }.direction:nth-child(8){ grid-column:1; grid-row:1; }
</style>
