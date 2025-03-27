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
            <g stroke="black">
                <LineTick v-for="tick in ticks" :tick></LineTick>
            </g>
        </svg>
        <Item v-for="(item,index) in itemList" 
            :item="item" 
            :index="index"
            :type="timeLine.targetType">
        </Item>
    </div>
    
</div>
</template>
 
<script setup lang='ts'>
    import { computed, provide, ref, useTemplateRef } from 'vue';
    import { TimeLineItem } from './item/item';
    import Item from "./item/Item.vue"
    import { getTimeRule, translateTimeValueToArr } from '@/supportAbility/customTime/translateTime';
import LineTick from './LineTick.vue';
    const {timeLine} = {timeLine:{
        targetType:"exitence",//时间线目标的类型
        timeRuleKey:"lJBZCzI5469McfKuOTizE",//该时间线所使用的时间规则的key
        now:null,//该时间线当前所处的位置，默认从最早的一个对象开始
        unitEnd:null,//该时间线当前所显示的最小单位
    }}
    // defineProps<{timeLine:TimeLine}>()

    //使用的时间规则
    const timeRule = getTimeRule(timeLine.timeRuleKey)
    //使用的最小单位
    const minUnit = computed(()=>{
        return timeLine.unitEnd
    })
    //提供给子元素
    provide("timeRule",timeRule)
    provide("minUnit",minUnit.value)
    // 时间轴上的各个对象
    const itemList = computed<TimeLineItem[]>(()=>{
        const list:TimeLineItem[] = [{
            label:["分类","事物"],
            key:{
                typeKey:"123",
                exitenceKey:"456"
            },
            time:10
        }]
        // return getTimeLineItems(timeLine)
        //按时间值排序
        list.sort((a,b)=>b.time - a.time)
        return list
    })

    //时间轴上各个对象的位置
    function getItemLocation(item:TimeLineItem){
        //获取该对象的时间值相较于当前指定的最小时间单位的值

        //获取该值在刻度上所处的位置，每10个刻度为1个最小时间单位
    }

    //点击到时间轴
    function clickLine(){
        //将指定位置聚焦，移动其到中心
    }

//拖动时间轴
    const timeLineLeft = ref(0) //时间线当前的移动距离
    let startLeft = 0 //时间线在移动之前的移动距离
    let isDragging = false //正在拖动
    let startX = 0
    const lineWidth = computed(()=>{
        const width = wrapper.value?.clientWidth??300
        return width - timeLineLeft.value
    })
    //时间线线条svg的长度
    const wrapper = useTemplateRef("wrapper")
    //svg线条的图形
    const path = computed(()=>{
        return `M0 0 L${lineWidth.value} 0`;
    })
    function dragStart(e:MouseEvent|TouchEvent){
        isDragging = true
        startLeft = timeLineLeft.value
        if (e instanceof MouseEvent) {
            startX = e.pageX;  // 鼠标事件
        } 
        else{
            startX = e.touches[0].pageX;  // 触摸事件
        }
    }
    //拖动时间轴
    function dragLine(e:MouseEvent|TouchEvent){
        if(!isDragging)return;
        let nowX
        if (e instanceof MouseEvent) {
            nowX = e.pageX;  // 鼠标事件
        } 
        else{
            nowX = e.touches[0].pageX;  // 触摸事件
        }
        const moveX = nowX - startX; // 计算鼠标移动的距离
        timeLineLeft.value = startLeft + moveX; // 更新时间线位置
    }
    function dragEnd(){
        isDragging = false
    }

//时间轴刻度
    /*这个时间轴的起始值
      即最小时间值对象的时间值，对应时间规则中的指定最小单位的值
      例如指定单位为日时，返回的是该时间值等于多少日*/
    const startValue = computed(()=>{
        if(!timeRule)return 0
        const minValue = itemList.value[0].time
        const arr = translateTimeValueToArr({
            value:minValue,
            "rule":timeRule,
            unitEnd:minUnit.value
        })
        //获取其中unitEnd的值
        const tmp = arr.find(item=>item.name == minUnit.value)
        if(!tmp)return 0
        return tmp.value
    })
    const shortTickNum = 4//两个长刻度中间的短刻度数量
    const tickSpacing = 10;//每个刻度的长度，单位px
    //每个刻度中间的距离
    const spacePerTick = computed(()=>{
        return tickSpacing*(shortTickNum+1)
    })
    //刻度分布情况
    const ticks = computed(()=>{
        //总的刻度数量
        const totalTicks = Math.floor((lineWidth.value) / tickSpacing);
        const ticks = [];
        for (let i = 0; i <= totalTicks; i++) {
            const value = startValue.value + i//该刻度对应的值
            const x = i * tickSpacing;//该刻度的位置
            ticks.push({
                value,
                x,
            });
        }
        return ticks;
    })


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