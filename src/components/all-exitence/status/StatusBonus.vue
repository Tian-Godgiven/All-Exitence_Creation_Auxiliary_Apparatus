<template>
<div class="statusBonus">
    <component :status :fullStatus :is="component"></component>
</div>
</template>

<script setup lang='ts'>
    import { statusBonusInputList } from '@/static/list/statusBonusInputList';
    import Status from '@/interfaces/Status';
    import { ExitenceStatus } from '@/class/Exitence';
import { computed } from 'vue';
    const {status,fullStatus} = defineProps<{
        status:Status|ExitenceStatus,
        fullStatus:Status
    }>()
    const component = computed(()=>{
        const valueType = fullStatus.valueType
        return statusBonusInputList[valueType]
    })
</script>

<style scoped lang='scss'>

</style>