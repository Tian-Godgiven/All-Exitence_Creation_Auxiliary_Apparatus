<template>
<div class="statusBonus">
    <component :status :fullStatus :is="statusBonusInputList[valueType]"></component>
</div>
</template>

<script setup lang='ts'>
    import { statusBonusInputList } from '@/static/list/statusBonusInputList';
    import Status from '@/interfaces/Status';
    import { ExitenceStatus } from '@/class/Exitence';
    const {status,fullStatus} = defineProps<{
        status:Status|ExitenceStatus,
        fullStatus:Status
    }>()
    const valueType = fullStatus.valueType
</script>

<style scoped lang='scss'>

</style>