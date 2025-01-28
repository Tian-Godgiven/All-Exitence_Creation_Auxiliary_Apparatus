<template>
    <div>{{ time }}</div>
</template>

<script setup lang='ts'>
    import { TimeItem, translateCustomTime } from '@/hooks/expression/customTime';
    import { computed } from 'vue';
    const {rule,value,unitFrom,unitEnd,linker=null,showUnit} = defineProps<TimeItem
    >()
    const time:any = computed(()=>{
        return translateCustomTime({
            value,
            rule,
            linker,
            showUnit,
            unitFrom,
            unitEnd
        })
    })
</script>

<style scoped lang='scss'>

</style>