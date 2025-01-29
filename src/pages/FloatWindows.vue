<template>
    <div class="floatWindowContainer">
        <component v-for="item in floatWindows" :key="item.__key" :is="item.vue"></component>
    </div>
</template>

<script setup lang='ts'>
    import { floatWindows } from '@/hooks/pages/floatWindow';
</script>

<style scoped lang='scss'>
    .floatWindowContainer{
        position: absolute;
        overflow: hidden;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 999;
        pointer-events: none;
        *{
            pointer-events: all;
        }
    }
</style>