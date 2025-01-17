<template>
    <div class="missionTime">直到{{ time }}</div>
</template>

<script setup lang='ts'>
    const {time} = defineProps<{time:Date}>()
</script>

<style scoped lang='scss'>
    .missionTime{
        width: 100%;
        max-height: 1rem;
    }
</style>