<template>
<div class="quickButtonPanelLine" @click="item.click">
    {{ item.label }}
</div>
</template>

<script setup lang='ts'>
    import { QuickPanelItem } from '@/hooks/pages/mainPage/quickButton';
    const {item} = defineProps<{item:QuickPanelItem}>()
</script>

<style scoped lang='scss'>
.quickButtonPanelLine{
    border-radius: $borderRadio;
    background-color: $bgColor80;
    box-shadow: $groundShadow;
    width: 200px;
    padding: 15px;
    overflow: hidden;
    box-sizing: border-box;
    transform-origin:bottom;
    transform: scaleY(0);
}
</style>