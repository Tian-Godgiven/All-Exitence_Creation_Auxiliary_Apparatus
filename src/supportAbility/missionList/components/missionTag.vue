<template>
    <div class="missionTag">[{{ tag }}<slot></slot>]
    </div>
</template>

<script setup lang='ts'>
    const {tag} = defineProps<{tag:string}>()
</script>

<style scoped lang='scss'>
    .missionTag{
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>