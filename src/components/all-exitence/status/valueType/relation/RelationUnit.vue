<template>
<div class="relationUnit">
    <RelationUnitStatus
        v-for="sourceStatus in source"
        :key="sourceStatus.__key"
        :sourceStatus
        :unit
        :target/>
</div>
</template>

<script setup lang='ts'>
        import { RelationSource, RelationUnit } from './relationStatus';
import { Type } from '@/class/Type';
import { Exitence } from '@/class/Exitence';
import RelationUnitStatus from './RelationUnitStatus.vue';
    const {source,unit,target} = defineProps<{
        source:RelationSource,
        unit:RelationUnit,
        target:Type|Exitence
    }>()
</script>

<style scoped lang='scss'>
.unitStatus{
    
    width: 100%;
}
</style>