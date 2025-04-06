<template>
    <g v-if="ifShow">
        <line :stroke-width="info.width" 
        :x1="tick.x" :y1="info.height" :x2="tick.x" :y2="-info.height" />
        <text v-if="info.text" 
            class="text"
            v-for="item,index in info.text"
            :x="tick.x-5" :y="20*(index+1)">
            {{ item }}
        </text>
    </g>
    
</template>

<script setup lang='ts'>
import { TimeRule } from '@/supportAbility/customTime/customTime';
import { computed, inject } from 'vue';
import { getStartTickInfo, getTickInfo } from '../timeLine';

    const {index} = defineProps<{
        index:number
    }>()

    const timeRule = inject<TimeRule>("timeRule","date")
    const minUnit = inject<string>("minUnit")
    //开始时间
    const startTime = inject<number>("startTime",0)
    const setting = inject("timeLineSetting",{
        space:10,
        equelUnit:1
    })

    const tick = computed(()=>{
         //刻度参数
        const x = (index*setting.space)/setting.equelUnit
        const value = startTime + index
        return {
            x,value
        }
    })
    const info = computed(()=>{
        //刻度info
        let info
        if(tick.value.x == 0){
            info = getStartTickInfo(tick.value.value,timeRule,minUnit)
        }
        else{
            info = getTickInfo(tick.value.value,timeRule,minUnit)
        }
        return info
    })
    const ifShow = computed(()=>{
        //如果这个值能够获得一个Info,或者是倍数的tick，则默认渲染它
        if(info.value.text || tick.value.value%setting.equelUnit == 0){
            return true
        }
        return false
    })

   
            
</script>   

<style scoped lang='scss'>
.text{
    font-size: 30px;
}
</style>