<template>
    <div>{{ time }}</div>
</template>

<script setup lang='ts'>
    import { TimeRule, TimeValue, translateCustomTime } from '@/hooks/expression/customTime';
    import { computed } from 'vue';
    const {timeRule,timeValue,unitFrom,unitEnd} = defineProps<{
        timeRule:TimeRule,timeValue:TimeValue,unitFrom?:string,unitEnd?:string}
    >()
    const time:any = computed(()=>{
        return translateCustomTime({
            value:timeValue,
            rule:timeRule,
            linker:null,
            showUnit:true,
            unitFrom,
            unitEnd
        })
    })
</script>

<style scoped lang='scss'>

</style>