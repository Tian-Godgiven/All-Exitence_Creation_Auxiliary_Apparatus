<template>
<div class="settings">
    <label><input v-model="showInLeft" type="checkbox">显示项目便签到左侧文章列表</label>
    <section class="colorSection">
        <h3>便签颜色</h3>
        <ColorManager />
    </section>
</div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { nowQuickDraftBoard } from "./quickDraft"
import ColorManager from "./ColorManager.vue"

const showInLeft = computed({ get: () => nowQuickDraftBoard.showInLeft, set: value => { nowQuickDraftBoard.showInLeft = value } })
</script>

<style scoped lang="scss">
.settings{display:flex;width:min(360px,80vw);flex-direction:column;gap:14px}.settings label{display:flex;align-items:center;gap:8px}.colorSection{padding-top:12px;border-top:1px solid $bgColor70}.colorSection h3{margin:0 0 10px;font-size:1rem}.colorSection :deep(.colorManager){min-width:0}
</style>
