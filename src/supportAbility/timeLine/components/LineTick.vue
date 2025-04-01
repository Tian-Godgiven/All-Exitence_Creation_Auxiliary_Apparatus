<template>
    <line :stroke-width="tickInfo.width" 
        :x1="tick.x" :y1="tickInfo.height" :x2="tick.x" :y2="-tickInfo.height" />
    <text v-if="tickInfo.text" 
        class="text"
        v-for="item,index in tickInfo.text"
        :x="tick.x-5" :y="20*(index+1)">
        {{ item }}
    </text>
</template>

<script setup lang='ts'>
    import { TimeRule } from '@/supportAbility/customTime/customTime';
import { inject } from 'vue';
import { getScaleInfo, getStartScaleInfo } from '../timeLine';
    const {tick} = defineProps<{tick:{x:number,value:number}}>()
    const timeRule = inject<TimeRule>("timeRule","date")
    const minUnit = inject<string>("minUnit")
    const tickInfo = function(){
        if(tick.x == 0){
            const tmp = getStartScaleInfo(tick.value,timeRule,minUnit)
            return tmp
        }
        return getScaleInfo(tick.value,timeRule,minUnit)
    }()
    
    
</script>   

<style scoped lang='scss'>
.text{
    font-size: 30px;
}
</style>