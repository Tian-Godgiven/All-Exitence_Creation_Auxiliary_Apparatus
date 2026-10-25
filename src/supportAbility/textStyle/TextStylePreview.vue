<template>
    <span class="textStylePreview" :class="{ textStyleShake: snapshot.effect === 'shake' && snapshot.value.synchronized, textStyleProgressiveBlur: snapshot.effect === 'blur' && snapshot.value.progressive }" :style="style">
        <template v-if="snapshot.effect === 'blur' && snapshot.value.progressive">
            <span class="textStyleProgressiveBlurContent">{{ text }}</span>
            <span class="textStyleProgressiveBlurOverlay" aria-hidden="true">{{ text }}</span>
        </template>
        <template v-else-if="snapshot.effect === 'shake' && !snapshot.value.synchronized"><span v-for="(character, index) in Array.from(text)" :key="index" class="textStylePreview textStyleShake" :style="characterStyle(index)">{{ character }}</span></template>
        <template v-else-if="snapshot.effect === 'offset'"><span v-for="(character, index) in Array.from(text)" :key="index" :style="offsetStyle(index)">{{ character }}</span></template>
        <template v-else>{{ text }}</template>
    </span>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { getTextStyleCss, textStyleDirections, type TextStyleSnapshot } from "@/hooks/expression/textAreaContent"

const { snapshot, text = "文字效果预览文字效果预览文字效果预览文字效果预览" } = defineProps<{ snapshot: TextStyleSnapshot, text?: string }>()
const offsetSeed = ref(0)
defineExpose({ rerollOffset: () => { offsetSeed.value = Math.random() * 100000 } })
const style = computed(()=>getTextStyleCss(snapshot))
function characterStyle(index: number){
    if(snapshot.effect !== "shake")return {}
    const shake = snapshot.value
    const directions = shake.directions ?? []
    const duration = 1 / (shake.frequency || 5.5)
    const path = Array.from({length:8},(_,step)=>{
        const allowed = directions.length ? directions : ["up", "right", "down", "left"]
        const pick = allowed[Math.floor(pseudoRandom(index * 19 + step * 7) * allowed.length)]
        return textStyleDirections.find(item=>item.value === pick) ?? textStyleDirections[0]
    })
    const result = getTextStyleCss({ ...snapshot, value: { ...shake, phase: -pseudoRandom(index * 13) * duration } })
    path.forEach((direction,step)=>{ Object.assign(result,{ [`--text-style-shake-x-${step + 1}`]:`${direction.x * shake.strength}px`, [`--text-style-shake-y-${step + 1}`]:`${direction.y * shake.strength}px` }) })
    return result
}
function pseudoRandom(seed:number){ const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453; return value - Math.floor(value) }
function offsetStyle(index:number){
    if(snapshot.effect !== "offset")return {}
    const amount = snapshot.value
    return { display:"inline-block", transform:`translate(${(pseudoRandom(index * 2 + offsetSeed.value) * 2 - 1) * amount}px, ${(pseudoRandom(index * 2 + 1 + offsetSeed.value) * 2 - 1) * amount}px)` }
}
</script>
