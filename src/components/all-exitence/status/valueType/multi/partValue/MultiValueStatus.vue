<template>
<StatusValue :status="status" :fullStatus="status" class="statusValue"/>
</template>

<script setup lang='ts'>
    import StatusValue from '../../../StatusValue.vue';
import { MultiStatusPart } from '@/hooks/expression/multiStatusValue';
import Status from '@/interfaces/Status';
import { computed } from 'vue';
    const {part} = defineProps<{
        part:MultiStatusPart
    }>()
    const status = computed(()=>{
        return part.value as Status
    })
</script>

<style scoped lang='scss'>

</style>