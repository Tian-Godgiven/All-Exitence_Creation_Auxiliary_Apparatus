<template>
<StatusValue :target :status="status" :fullStatus="status" class="statusValue"/>
</template>

<script setup lang='ts'>
    import { Type } from '@/class/Type';
import StatusValue from '../../../StatusValue.vue';
import { MultiStatusPart } from '@/hooks/expression/multiStatusValue';
import Status from '@/interfaces/Status';
import { computed } from 'vue';
import { Exitence } from '@/class/Exitence';
    const {part,target} = defineProps<{
        part:MultiStatusPart,
        target:Type|Exitence
    }>()
    const status = computed(()=>{
        return part.value as Status
    })
</script>

<style scoped lang='scss'>

</style>