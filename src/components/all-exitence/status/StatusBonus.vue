<template>
<div class="statusBonus">
    <component :status :fullStatus :target :is="component"></component>
</div>
</template>

<script setup lang='ts'>
    import { statusBonusInputList } from '@/static/list/statusBonusInputList';
    import Status from '@/interfaces/Status';
    import { Exitence, ExitenceStatus } from '@/class/Exitence';
    import { computed } from 'vue';
    import { Type } from '@/class/Type';
    const {status,fullStatus,target} = defineProps<{
        status:Status|ExitenceStatus,
        fullStatus:Status,
        target:Exitence|Type
    }>()
    const component = computed(()=>{
        const valueType = fullStatus.valueType
        return statusBonusInputList[valueType]
    })
</script>

<style scoped lang='scss'>

</style>