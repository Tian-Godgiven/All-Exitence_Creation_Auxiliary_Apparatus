<template>
<svg class="line">
    <path :d="path" stroke="black" stroke-width="2" fill="none"/>
    <g stroke="black">
        <LineTick v-for="tick in tickList" 
            :tick></LineTick>
    </g>
</svg>
</template>

<script setup lang='ts'>
    import { computed, inject } from 'vue';
    import LineTick from './LineTick.vue';
import { TimeRule } from '@/supportAbility/customTime/customTime';
import { getStartTickInfo, getTickInfo } from '../timeLine';

    const {lineWidth} = defineProps<{lineWidth:number}>()

    const timeRule = inject<TimeRule>("timeRule","date")
    const minUnit = inject<string>("minUnit")
    //开始时间
    const startTime = inject<number>("startTime",0)
    const setting = inject("timeLineSetting",{
        space:10,
        equelUnit:1
    })

    //svg线条的图形
    const path = computed(()=>{
        return `M0 0 L${lineWidth} 0`;
    })

    //总刻度列表
    const tickList = computed(()=>{ 
        //刻度总数量
        const tickNum = lineWidth/(setting.space/setting.equelUnit)
        console.log(tickNum)
        const tickList = []
        for(let i = 0;i<tickNum;i++){
            //刻度参数
            const x = (i*setting.space)/setting.equelUnit
            const value = startTime + i
            //刻度info
            let info
            if(x == 0){
                info = getStartTickInfo(value,timeRule,minUnit)
            }
            else{
                info = getTickInfo(value,timeRule,minUnit)
            }
            //如果这个值能够获得一个Info，则默认渲染它
            if(info.text){
                tickList.push({
                    x,
                    ...info
                })
            }
            //否则仅渲染倍数的tick
            else if(value%setting.equelUnit == 0){
                tickList.push({
                    x,
                    ...info
                })
            }
        }
        return tickList
    })
</script>

<style scoped lang='scss'>

</style>