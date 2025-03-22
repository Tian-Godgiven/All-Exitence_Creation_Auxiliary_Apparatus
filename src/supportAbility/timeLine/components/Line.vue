<template>
<div class="timeLine"
        @mousedown="dragStart" 
        @mousemove="dragLine" 
        @mouseup="dragEnd">
    <div class="wrapper" 
        ref="wrapper"
        :style="{ left: timeLineLeft + 'px' }">
        <svg class="line">
            <path :d="path" stroke="black" stroke-width="2" fill="none"/>
        </svg>
        <Item v-for="(item,index) in itemList" 
            :item="item" 
            :index="index"
            :type="timeLine.targetType">
        </Item>
        <div>时间刻度</div>
    </div>
    
</div>
</template>
 
<script setup lang='ts'>
    import { computed, ref, useTemplateRef } from 'vue';
    import { TimeLine } from '../timeLine';
    import { getTimeLineItems, TimeLineItem } from './item/item';
    import Item from "./item/Item.vue"
    const {timeLine} = {timeLine:{
        targetType:"exitence"
    }}
    // defineProps<{timeLine:TimeLine}>()
    // 时间轴上的各个对象
    const itemList = computed<TimeLineItem[]>(()=>{
        return [{
            label:["分类","事物"],
            key:{
                typeKey:"123",
                exitenceKey:"456"
            },
            time:10
        }]
        // return getTimeLineItems(timeLine)
    })

    //点击到时间轴
    function clickLine(){
        //将指定位置聚焦，移动其到中心
    }

    //拖动时间线
    const timeLineLeft = ref(0) //时间线当前的移动距离
    const startLeft = ref(0) //时间线在移动之前的移动距离
    const isDragging = ref(false) //正在拖动
    const startX = ref(0)
    //时间线线条svg的长度
    const wrapper = useTemplateRef("wrapper")
    const path = computed(()=>{
        const width = wrapper.value?.clientWidth??300
        return `M0 0 L${width-timeLineLeft.value} 0`;
    })
    function dragStart(e:MouseEvent|TouchEvent){
        isDragging.value = true
        startLeft.value = timeLineLeft.value
        if (e instanceof MouseEvent) {
            startX.value = e.pageX;  // 鼠标事件
        } 
        else{
            startX.value = e.touches[0].pageX;  // 触摸事件
        }
    }
    //拖动时间轴
    function dragLine(e:MouseEvent|TouchEvent){
        if(!isDragging.value)return;
        let nowX
        if (e instanceof MouseEvent) {
            nowX = e.pageX;  // 鼠标事件
        } 
        else{
            nowX = e.touches[0].pageX;  // 触摸事件
        }
        const moveX = nowX - startX.value; // 计算鼠标移动的距离
        timeLineLeft.value = startLeft.value + moveX; // 更新时间线位置
    }
    function dragEnd(){
        console.log("拖动停止")
        isDragging.value = false
    }
</script>

<style scoped lang='scss'>
.timeLine {
    position: relative;
    width: 100%;
    height: 300px;
    overflow: hidden;
    cursor: grab;
}

.wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    left: 0;
    display: flex;
}

.line {
    position: absolute;
    width: 100%;
    height: 100px;
    overflow: visible;
}
</style>