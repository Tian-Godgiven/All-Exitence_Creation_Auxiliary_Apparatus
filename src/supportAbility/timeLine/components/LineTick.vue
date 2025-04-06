<template>
    <line :stroke-width="tick.width" 
        :x1="tick.x" :y1="tick.height" :x2="tick.x" :y2="-tick.height" />
    <text v-if="tick.text" 
        class="text"
        v-for="item,index in tick.text"
        :x="tick.x-5" :y="20*(index+1)">
        {{ item }}
    </text>
</template>

<script setup lang='ts'>
    const {tick} = defineProps<{
        tick:{
            x:number,
            width:number,
            height:number,
            text:string[]
        }
    }>()
</script>   

<style scoped lang='scss'>
.text{
    font-size: 30px;
}
</style>