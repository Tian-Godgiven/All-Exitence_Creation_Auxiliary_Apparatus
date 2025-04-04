<template>
<svg class="line">
    <path :d="path" stroke="black" stroke-width="2" fill="none"/>
    <g stroke="black">
        <LineTick :tick="{x:0,value:startTime}"></LineTick>
        <LineTick v-for="index in ticksNum" 
            :tick="{value:startTime+index,x:index*tickSpacing}">
        </LineTick>
    </g>
</svg>
</template>

<script setup lang='ts'>
    import { computed, inject } from 'vue';
    import LineTick from './LineTick.vue';

    const {lineWidth} = defineProps<{
        lineWidth:number,
    }>()

    //开始时间
    const startTime = inject<number>("startTime",0)

    //svg线条的图形
    const path = computed(()=>{
        return `M0 0 L${lineWidth} 0`;
    })

    //时间轴刻度
    const tickSpacing = inject<number>("tickSpacing",10);//每个刻度的长度，单位px

    //总刻度数量
    const ticksNum = computed(()=>{
        return Math.floor((lineWidth) / tickSpacing)
    })
</script>

<style scoped lang='scss'>

</style>