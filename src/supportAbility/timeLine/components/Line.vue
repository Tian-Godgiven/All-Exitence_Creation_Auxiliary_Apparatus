<template>
    <div class="timeLine">
        <div>一条无限向后的直线
            <Item v-for="(item,index) in itemList" :item="item" :index="index"></Item>
        </div>
        <div>时间刻度</div>
    </div>
</template>

<script setup lang='ts'>
    import { computed, ref } from 'vue';
import { getTimeLineItems, TimeLine } from '../timeLine';
import Item from "./Item.vue"
    const {timeLine} = defineProps<{timeLine:TimeLine}>()
    //时间轴上的各个对象
    const itemList = computed(()=>{
        return getTimeLineItems(timeLine)
    })

    //点击到时间轴
    function clickLine(){
        //将指定位置聚焦，移动其到中心
    }
    //拖动时间轴
    function dragLine(){

    }
</script>

<style scoped lang='scss'>

</style>