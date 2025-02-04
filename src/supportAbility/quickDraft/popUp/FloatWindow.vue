<template>
    <FloatButton 
        ref="floatWindowRef"
        :ifLongTap="false"
        :onMove="onMove" 
        :click="click" 
        :allowEdge="foldFloatWindow"
        class="quickDraftFloatWindow"
        :class={fold:foldFloatWindow,unfold:!foldFloatWindow,focusing:ifFocusing}
        v-click-outside = "clickOutside"
        >
        <div v-if="foldFloatWindow" class="text">暂记</div>
        <FocusingPage v-else 
            :float="true" :foldFloatWindow="fold"/>
    </FloatButton>
</template>

<script setup lang='ts'>
import FloatButton from '@/components/floatWindow/floatButton.vue';
import { ref } from 'vue';
import { addQuickDraftItem, createQuickDraftItem, focusingItem, foldFloatWindow, nowQuickDraftSetting, showFocusingPage, switchFoldFloatWindow} from '../quickDraft';
import FocusingPage from '../component/FocusingPage.vue';
import { doNotOverContainer } from '@/api/doNotOverContainer';
    //点击聚焦,聚焦时点击展开,展开时持续保持聚焦状态
    const ifFocusing = ref(false)
    function click(){
        //聚焦时点击：展开
        if(ifFocusing.value){unfold()}
        ifFocusing.value = true
    }
    //展开:显示暂记版的聚焦界面
    const floatWindowRef = ref()
    function unfold(){
        //如果已经展开了
        if(!foldFloatWindow.value)return
        //如果当前有聚焦对象，则显示
        if(focusingItem.value){showFocusingPage()}
        //否则创建,添加一个空的暂记对象,再显示这个暂记对象
        else{
            const item = createQuickDraftItem()
            addQuickDraftItem(item)
            showFocusingPage(item)
        }
        //将其展开
        switchFoldFloatWindow(false)
        //控制其位置，展开后不要超出边缘
        setTimeout(()=>{
            //不要超出边缘
            if(!floatWindowRef.value)return
            const dom = floatWindowRef.value.$el.nextElementSibling
            //记录展开前的位置
            position[0] = dom.offsetLeft
            position[1] = dom.offsetTop
            doNotOverContainer(dom,document.body,"all",10,0.2)
        },1)
    }
    //折叠:重新设置位置到折叠前
    function fold(){
        switchFoldFloatWindow(true)
        if(!floatWindowRef.value)return
        const dom = floatWindowRef.value.$el.nextElementSibling
        dom.style.left = position[0]+"px"
        dom.style.top = position[1]+"px"
    }
    //点击外部：折叠时失去聚焦
    function clickOutside(){
        if(foldFloatWindow.value){
            ifFocusing.value = false
        }
    }
    //悬浮窗的拖动
    const moving = ref(false) //正在拖动
    let position:[number,number] = [0,0] //记录的位置
    let oldPosition:[number,number] = [0,0] //展开状态时，移动前的位置
    function onMove(state:"start"|"stop",dom:HTMLElement){
        if(state=="start"){
            moving.value = true
            oldPosition = [dom.offsetLeft,dom.offsetTop]
        }
        else if(state=="stop"){
            moving.value = false
            const newPosition:[number,number] = [dom.offsetLeft,dom.offsetTop]
            //如果是展开状态，则使用移动了的距离来改变position
            if(!foldFloatWindow.value){
                position = [position[0]+newPosition[0]-oldPosition[0],
                            position[1]+newPosition[1]-oldPosition[1]]
            }
            else{
                //获得其现在的位置保存到position与设置当中
                position = newPosition
            }
            //保存在设置中
            nowQuickDraftSetting.floatWindow.position = position
        }
    }
</script>

<style scoped lang='scss'>
@use "@/static/style/global.scss" as global;
    .quickDraftFloatWindow{
        position: absolute;
        top: 100px;
        left: 500px;
        color: global.$antiBgColor;
        background-color: global.$bgColor;
        border-radius: 10px;
        box-shadow: 0px 0px 10px 1px global.$bgColor40;
        z-index: 999;
        &.fold{
            width: 100px;
            height: 100px;
        }
        &.unfold{
            width: 70%;
            height: 50%;
        }
        &.focusing{
            box-shadow: 0px 0px 10px 1px rgb(0, 0, 0);
        }
    }
    
</style>