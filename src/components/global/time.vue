<template>
    <div>{{ time }}</div>
</template>

<script setup lang='ts'>
    import {TimeTranslateItem, translateTimeValueToString } from '@/supportAbility/customTime/translateTime';
    import { computed } from 'vue';
    const {rule,value,unitFrom,unitEnd,linker=false,showUnit} = defineProps<TimeTranslateItem>()
    const time:any = computed(()=>{
        return translateTimeValueToString({
            value,
            rule,
            linker,
            showUnit,
            unitFrom,
            unitEnd
        } as TimeTranslateItem)
    })
</script>

<style scoped lang='scss'>

</style>