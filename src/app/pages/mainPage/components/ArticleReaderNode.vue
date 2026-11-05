<template>
    <component :is="tag" class="readerStyle" :class="classes" :style="style">
        <template v-if="isProgressiveBlur">
            <component :is="isParagraph ? 'div' : 'span'" class="blurBase"><ArticleReaderContent :content="node.content" :paragraphs="isParagraph" /></component>
            <component :is="isParagraph ? 'div' : 'span'" class="blurOverlay" aria-hidden="true"><ArticleReaderContent :content="node.content" :paragraphs="isParagraph" /></component>
        </template>
        <ArticleReaderContent v-else :content="node.content" :paragraphs="isParagraph" />
    </component>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { TextStyleData } from "@/hooks/expression/textAreaContent"
import { getDirectionCss } from "@/hooks/expression/textAreaContent"
import ArticleReaderContent from "./ArticleReaderContent.vue"

const { node } = defineProps<{ node:TextStyleData }>()
const isParagraph = computed(()=>node.scope === "paragraph")
const tag = computed(()=>isParagraph.value ? "div" : "span")
const isProgressiveBlur = computed(()=>node.snapshot.effect === "blur" && node.snapshot.value.progressive)
const classes = computed(()=>({
    paragraphEffect:isParagraph.value,
    progressiveBlur:isProgressiveBlur.value,
    progressiveOpacity:node.snapshot.effect === "opacity" && node.snapshot.value.progressive,
    spoiler:node.snapshot.effect === "spoiler",
}))
const style = computed<Record<string,string|number>>(()=>{
    const snapshot = node.snapshot
    if(snapshot.effect === "fontWeight")return { fontWeight:snapshot.value }
    if(snapshot.effect === "italic")return { fontStyle:"italic" }
    if(snapshot.effect === "color")return { color:snapshot.value }
    if(snapshot.effect === "blur")return snapshot.value.progressive ? {
        "--blur-start":`${snapshot.value.startAmount}px`, "--blur-end":`${snapshot.value.amount}px`, "--effect-direction":getDirectionCss(snapshot.value.direction), "--effect-center":`${snapshot.value.center}%`,
    } : { filter:`blur(${snapshot.value.amount}px)` }
    if(snapshot.effect === "opacity")return snapshot.value.progressive ? {
        "--opacity-start":String(snapshot.value.startOpacity / 100), "--opacity-end":String(snapshot.value.opacity / 100), "--effect-direction":getDirectionCss(snapshot.value.direction), "--effect-center":`${snapshot.value.center}%`,
    } : { opacity:snapshot.value.opacity / 100 }
    return {}
})
</script>

<style scoped lang="scss">
.readerStyle { position:relative; }.paragraphEffect { display:inline-block; width:fit-content; max-width:100%; }.paragraphEffect :deep(.articleParagraph) { min-height:1.4em; }.progressiveBlur > .blurBase,.progressiveBlur > .blurOverlay { mask-repeat:no-repeat; mask-size:100% 100%; }.blurBase { filter:blur(var(--blur-start)); mask-image:linear-gradient(var(--effect-direction), black 0%, black calc(var(--effect-center) - 50%), transparent calc(var(--effect-center) + 50%), transparent 100%); }.blurOverlay { position:absolute; inset:0; pointer-events:none; filter:blur(var(--blur-end)); mask-image:linear-gradient(var(--effect-direction), transparent 0%, transparent calc(var(--effect-center) - 50%), black calc(var(--effect-center) + 50%), black 100%); }.progressiveOpacity { mask-image:linear-gradient(var(--effect-direction), rgb(0 0 0 / var(--opacity-start)) 0%, rgb(0 0 0 / var(--opacity-start)) var(--effect-center), rgb(0 0 0 / var(--opacity-end)) 100%); }.spoiler { padding:0 2px; border-radius:2px; background:$antiBgColor; color:$bgColor; }
</style>
