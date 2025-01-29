<template>
    <FloatButton 
        v-show="foldFloatWindow"
        :onMove="onMove" 
        :click="unfold" 
        class="quickDraftFloatWindow"
        :class="moving?'onMoving':''">
            暂记版
    </FloatButton>
</template>

<script setup lang='ts'>
import FloatButton from '@/components/floatWindow/floatButton.vue';
import { ref } from 'vue';
import { foldFloatWindow, showQuickDraftPopUp } from '../quickDraft';
    //当前所处的位置
    let position = "top"
    //展开暂记版:根据位置在对应的半屏显示暂记版
    function unfold(){
        console.log("响应了")
        foldFloatWindow.value = false
        if(position == "top"){
            console.log("hera")
            //上半屏显示暂记版
            showQuickDraftPopUp({
                y:"0px"
            },{
                height:"30%",
                width:"100%"
            })
        }
        else{
            console.log(position)
            //下半屏显示暂记版
            showQuickDraftPopUp({
                y:"50%"
            },{
                height:"50%",
                width:"100%"
            })
        }
    }
    //悬浮窗的拖动
    const moving = ref(false)
    function onMove(state:"start"|"stop",dom:HTMLElement){
        if(state=="start"){
            moving.value = true
        }
        else if(state=="stop"){
            moving.value = false
        }
        const rect = dom.getBoundingClientRect()
        const screenHeight = window.innerHeight;  // 获取视口的高度
        // 判断组件的中心高度是否小于屏幕高度的一半
        if (rect.top + rect.height / 2 < screenHeight / 2) {
            position = "top"
        } else {
            position = "bottom"
        }
    }
</script>

<style scoped lang='scss'>
@use "@/static/style/global.scss" as global;
    .quickDraftFloatWindow{
        position: absolute;
        width: 100px;
        height: 100px;
        top: 100px;
        left: 500px;
        color: global.$antiBgColor;
        background-color: global.$bgColor;
        border-radius: 10px;
        box-shadow: 0px 0px 10px 1px global.$bgColor40;
        z-index: 999;
    }
    .onMoving{
        box-shadow: 0px 0px 10px 1px blue;
    }
</style>