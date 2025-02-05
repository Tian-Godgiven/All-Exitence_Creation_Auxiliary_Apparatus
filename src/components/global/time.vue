<template>
    <div>{{ time }}</div>
</template>

<script setup lang='ts'>
    import {CustomTimeTranslateItem, translateCustomTime } from '@/supportAbility/customDate/translateTime';
    import { computed } from 'vue';
    const {rule,value,unitFrom,unitEnd,linker=null,showUnit} = defineProps<CustomTimeTranslateItem>()
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