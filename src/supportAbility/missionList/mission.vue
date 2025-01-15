<template>
    <div>
        <div>标题</div>
        <div>内容</div><div>重复次数</div>
        <div>标签（短期/长期等预设标签） + 限时</div>
        <div>状态？</div>
        <div>拖动手柄</div>
        <div>←滑显示编辑and删除键</div>
    </div>
</template>

<script setup lang='ts'>
    import { ref } from 'vue';
    import { Mission } from './missionList';
    const {mission} = defineProps<{mission:Mission}>()
    
</script>

<style scoped lang='scss'>

</style>