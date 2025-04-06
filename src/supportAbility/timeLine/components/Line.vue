<template>
<svg class="line">
    <path :d="path" stroke="black" stroke-width="2" fill="none"/>
    <g stroke="black">
        <LineTick :index = 0></LineTick>
        <LineTick v-for="index in tickNum" :index></LineTick>
    </g>
</svg>
</template>

<script setup lang='ts'>
    import { computed, inject } from 'vue';
    import LineTick from './LineTick.vue';

    const {lineWidth} = defineProps<{lineWidth:number}>()
    const setting = inject("timeLineSetting",{
        space:10,
        equelUnit:1
    })

    //svg线条的图形
    const path = computed(()=>{
        return `M0 0 L${lineWidth} 0`;
    })

    //总刻度列表
    const tickNum = computed(()=>{ 
        //刻度总数量
        const tickNum = Math.floor(lineWidth/(setting.space/setting.equelUnit))
        return tickNum
    })
</script>

<style scoped lang='scss'>

</style>