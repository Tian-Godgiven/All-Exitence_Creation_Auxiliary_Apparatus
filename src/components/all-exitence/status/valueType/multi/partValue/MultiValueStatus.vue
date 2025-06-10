<template>
<StatusValue :status="status" :fullStatus="fullStatus" class="statusValue"/>
</template>

<script setup lang='ts'>
    import StatusValue from '../../../StatusValue.vue';
import Status from '@/interfaces/Status';
import { ExitenceStatus } from '@/class/Exitence';
    const {status,fullStatus} = defineProps<{
        status:Status|ExitenceStatus,
        fullStatus:Status
    }>()
</script>

<style scoped lang='scss'>

</style>