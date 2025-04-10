<template>
<div class="timeLine"
        @mousedown="dragStart" 
        @mousemove="dragLine" 
        @mouseup="dragEnd">
    <div class="title">
        <div class="name">{{ timeLine.name??"未命名" }}</div>
        <div class="ability" v-if="!manageMode">
            <Button @click="upScale" name="放大"></Button>
            <Button @click="downScale" name="缩小"></Button>
            <Button @click="showEditTimeLine(timeLine)" name="编辑"></Button>
        </div>
        <div class="ability" v-else>
            <Button @click="upTimeLine(timeLine)" name="上移" icon="upArrow" :disabled="timeLineIndex == 0"></Button>
            <Button @click="downTimeLine(timeLine)" name="下移" icon="downArrow" :disabled="timeLineIndex == nowAllTimeLine.length-1"></Button>
            <Button @click="deleteTimeLine(timeLine)" name="删除"></Button>
        </div>
    </div>
   
    <div class="wrapper"  
        ref="wrapper"
        :style="{ left: timeLineLeft + 'px' }">
        <Line :lineWidth></Line>
        <Item v-for="(item,index) in itemList" 
            :key="index"
            :item="item" 
            :index="index"
            :type="timeLine.targetType">
        </Item>
    </div>
    
</div>
</template>
 
<script setup lang='ts'>
    import { computed, inject, provide, reactive, ref, useTemplateRef, watch } from 'vue';
    import { getTimeLineItems} from './item/item';
    import Item from "./item/Item.vue"
    import { getTimeRule, translateTimeUnitValueToValue, translateTimeValueEqualToUnit } from '@/supportAbility/customTime/translateTime';
    import Line from "./Line.vue"
    import {getTimeLocation, deleteTimeLine, getSmallestTime, TimeLine, getBiggerUnit, getSmallerUnit, upTimeLine, downTimeLine, nowAllTimeLine } from '../timeLine';
    import Button from '@/components/global/Button.vue';
    import { showEditTimeLine } from '../popUp/editTimeLine/editTimeLine';
    const {timeLine} = defineProps<{timeLine:TimeLine}>()
    //时间轴的Index
    const timeLineIndex = computed(()=>{
        const tmp = nowAllTimeLine.indexOf(timeLine)
        return tmp
    })
    //管理模式
    const manageMode = inject("manageMode",false)

    // 时间轴上的各个对象
    const itemList = computed(()=>{
        const list = getTimeLineItems(timeLine)
        if(list){
            //按时间值从小到大排序
            list.sort((a,b)=>a.time - b.time)
            return list
        }
        return []
    })
    // 对象获取其在时间轴上的位置
    const getItemX = (itemTime:number)=>{
        const x = getTimeLocation(itemTime,timeRule.value,startTime.value,pxPerUnit.value,minUnit.value) 
        return x
    }
    provide("getItemX",getItemX)

    //使用的时间规则
    const timeRule = computed(()=>{
        console.log(timeLine.timeRuleKey)
        return getTimeRule(timeLine.timeRuleKey)
    }) 
    //使用的最小单位
    const minUnit = computed(()=>{
        return timeLine.unitEnd
    })
    /*这个时间轴的起始值
    即最小时间值对象的时间值最接近的，对应时间规则中的指定最小单位的值*/
    const startTime = computed<number>(()=>{
        if(!timeRule.value)return 0
        let minTime = itemList.value[0]?.time
        //如果时间轴设置中的起始时间更小
        const timeLineStart = timeLine.setting.start
        if(timeLineStart && timeLineStart < minTime){
            minTime = timeLineStart
        }
        const tmp = getSmallestTime(minTime,timeRule.value,minUnit.value)
        return tmp
    })
    // 这个时间轴传递给tick的起始index值，使用这个值来计算每个tick的文本
    const startIndex = computed(()=>{
        if(!timeRule.value)return 0
        //把它变成刻度的值，不包含小数点
        const startValue = translateTimeValueEqualToUnit(startTime.value,timeRule.value,minUnit.value)
        return startValue
    })

    //提供给子元素
    provide("timeRule",timeRule.value)
    provide("minUnit",minUnit)
    provide("startTime",startIndex)

    //时间轴设置
    const setting = reactive({
        space:timeLine.setting?.space??20,
        equelUnit:timeLine.setting?.equelUnit??1
    })
    watch(setting,()=>{
        timeLine.setting["space"] = setting.space
        timeLine.setting["equelUnit"] = setting.equelUnit
    },{
        deep:true
    })
    //1最小单位等于多少px
    const pxPerUnit = computed(()=>{
        return setting.space/setting.equelUnit
    })
    provide("timeLineSetting",setting)

    //放大时间轴，让时间轴涵盖的时间值变小
    function upScale(){
        //优先减少刻度值，不少于1倍
        if(setting.equelUnit > 1){
            setting.equelUnit -= 1
        }
        //增加刻度间隔
        else if(setting.space < 50){
            setting.space += 10
        }
        //否则换用更大1位的最小刻度
        else if(timeRule.value){
            const smaller = getSmallerUnit(timeRule.value,minUnit.value)
            if(smaller){
                timeLine.unitEnd = smaller
                //重置设置
                setting.equelUnit = 4;
                setting.space = 10
            }
        }
    }
    //缩小时间轴,让时间轴涵盖的时间值变大，减少刻度间隔或让单个刻度的值增加
    function downScale(){
        //优先减少刻度间隔
        if(setting.space > 10){
            setting.space -= 10
        }
        //否则增大刻度值，不超过4倍
        else if(setting.equelUnit <= 4){
            setting.equelUnit += 1
        }
        //否则换用更大1位的最小刻度
        else if(timeRule.value){
            const bigger = getBiggerUnit(timeRule.value,minUnit.value)
            if(bigger){
                timeLine.unitEnd = bigger
                //重置设置
                setting.equelUnit = 1;
                setting.space = 50
            } 
        }
    }


    //拖动时间轴
    const timeLineLeft = ref(function(){
        //当前时间在时间轴上的位置，若无则设定为0
        const nowTime = timeLine.setting.now
        if(!nowTime)return 0
        const x = getTimeLocation(nowTime,timeRule.value,startTime.value,pxPerUnit.value,minUnit.value)
        if(!x)return 0
        return -x 
    }()) //时间线当前的移动距离
    let startLeft = 0//时间线在移动之前的移动距离
    let isDragging = false //正在拖动
    let startX = 0
    const wrapper = useTemplateRef("wrapper")
    //时间线线条svg的长度
    const lineWidth = computed(()=>{
        const width = wrapper.value?.clientWidth??300
        const length = width - timeLineLeft.value
        if(length < 100){
            return 100
        }
        return length
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
        //当前的时间轴位置对应的当前最小单位的值
        // (由于时间轴是向右移动的所以left为负值)
        const minUnitValue = -timeLineLeft.value / pxPerUnit.value
        let nowValue = minUnitValue
        //转化为实际的时间值
        if(minUnit.value && timeRule.value){
            //这个最小单位值要加到起始值上
            nowValue = startIndex.value + minUnitValue
            //该最小单位的值等于多少自然值
            const tmp = translateTimeUnitValueToValue(nowValue,minUnit.value,timeRule.value)
            if(tmp){
                nowValue = tmp
            }
        }
        //如果当前值差太远（看不到了）则设置为起始值
        if(nowValue < startTime.value){
            nowValue = startTime.value
        }
        timeLine.setting.now = nowValue
    }
</script>

<style scoped lang='scss'>
.timeLine {
    position: relative;
    width: 100%;
    height: 300px;
    overflow: hidden;
    cursor: grab;
    .title{
        display: flex;
        width: 100%;
        height: 40px;
        .name{
            width: 70%;
        }
        .ability{
            width: 30%;
            height: 50px;
            display: flex;
            justify-content: flex-end;
            .button{
                width: 50px;
                height: 50px;
            }
        }
    }
    
    .wrapper {
        position: relative;
        width: 100%;
        height: 260px;
        top: 130px;
        margin:0 10px;
        .line {
            position: absolute;
            width: 100%;
            height: 100px;
            overflow: visible;
        }
    }
}





</style>