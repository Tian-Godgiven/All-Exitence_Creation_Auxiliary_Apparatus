<template>
    <line :stroke-width="tickInfo.width" 
        :x1="tick.x" :y1="tickInfo.height" :x2="tick.x" :y2="-tickInfo.height" />
    <text v-if="tickInfo.text" 
        v-for="item,index in tickInfo.text"
        :x="tick.x-5" :y="25*(index+1)">
        {{ item }}
    </text>
</template>

<script setup lang='ts'>
    import { TimeRule } from '@/supportAbility/customTime/customTime';
import { inject } from 'vue';
import { getScaleInfo } from '../timeLine';
    const {tick} = defineProps<{tick:{x:number,value:number}}>()
    const timeRule = inject<TimeRule>("timeRule","date")
    const minUnit = inject<string>("minUnit")

    const tickInfo = getScaleInfo(tick.value,timeRule,minUnit)
    
</script>   

<style scoped lang='scss'>

</style>