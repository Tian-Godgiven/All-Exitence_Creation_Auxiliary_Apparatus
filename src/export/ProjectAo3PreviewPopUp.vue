<template>
    <section class="ao3Preview">
        <iframe class="ao3RenderPreview" :srcdoc="props.document" sandbox title="AO3 发布效果预览"></iframe>
        <textarea readonly :value="props.code"></textarea>
        <FinalButtons :buttons="[{ name: '复制 HTML + CSS', click: copy }, { name: '返回', click: () => closePopUp(popUp) }]" />
    </section>
</template>

<script setup lang="ts">
import { closePopUp, type PopUp } from "@/hooks/pages/popUp"
import { showQuickInfo } from "@/api/showQuickInfo"
import FinalButtons from "@/app/stacks/popUp/FinalButtons.vue"

const { popUp, props } = defineProps<{ popUp: PopUp, props: { code: string, document: string } }>()

async function copy(){
    try{ await navigator.clipboard.writeText(props.code); showQuickInfo("AO3 发布代码已复制") }
    catch{ showQuickInfo("复制失败，请手动复制预览代码") }
}
</script>

<style scoped lang="scss">
.ao3Preview { width: min(720px, calc(100vw - 64px)); display: flex; flex-direction: column; gap: 10px; }
.ao3RenderPreview { width: 100%; height: 240px; box-sizing: border-box; border: 1px solid $bgColor85; border-radius: 4px; background: $bgColor; }
textarea { width: 100%; height: 260px; box-sizing: border-box; resize: vertical; border: 1px solid $inputBorderColor; border-radius: 4px; padding: 7px; background: $bgColor; color: $textColor; font: .8rem/1.5 Consolas, monospace; }
@media (max-width: 600px) { .ao3Preview { width: min(100%, calc(100vw - 32px)); } }
</style>
