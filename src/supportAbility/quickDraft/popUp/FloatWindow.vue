<template>
<FloatButton 
    ref="floatWindowRef"
    icon="quickDraft"
    name="quickDraftFloatButton"
    :ifLongTap="false"
    :onMove="onMove" 
    :click="click" 
    :allowEdge="foldFloatWindow"
    class="quickDraftFloatWindow"  
    :style="{
        top:position[0]+'px',
        left:position[1]+'px'
    }"
    :class={fold:foldFloatWindow,unfold:!foldFloatWindow,focusing:ifFocusing}
    v-click-outside = "clickOutside"
    >
    <div class="iconContainer"  v-show="foldFloatWindow" >
        <Icon icon="quickDraft" name="quickDraftFloatButton"></Icon>
    </div>
    
    <FocusingPage class="focusingPage" v-show="!foldFloatWindow"
        :float="true" :foldFloatWindow="fold"/>
</FloatButton>
</template>

<script setup lang='ts'>
import FloatButton from '@/components/floatWindow/floatButton.vue';
import { ref } from 'vue';
import { addQuickDraftItem, createQuickDraftItem, focusingItem, foldFloatWindow, nowQuickDraftSetting, showFocusingPage, switchFoldFloatWindow} from '../quickDraft';
import FocusingPage from '../component/FocusingPage.vue';
import { doNotOverContainer } from '@/api/doNotOverContainer';
import Icon from '@/components/global/Icon.vue';
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
            const dom = floatWindowRef.value.$el
            //记录展开前的位置
            position[0] = dom.offsetTop
            position[1] = dom.offsetLeft
            doNotOverContainer(dom,document.body,"all",10,0.2)
        },1)
    }
    //折叠:重新设置位置到折叠前
    function fold(){
        switchFoldFloatWindow(true)
        if(!floatWindowRef.value)return
        const dom = floatWindowRef.value.$el
        dom.style.top = position[0]+"px"
        dom.style.left = position[1]+"px"
    }
    //点击外部：折叠时失去聚焦
    function clickOutside(){
        if(foldFloatWindow.value){
            ifFocusing.value = false
        }
    }

    //悬浮窗的拖动
    const moving = ref(false) //正在拖动
    //当前位置or初始位置
    let position:[number,number] = nowQuickDraftSetting.floatWindow.position
    //展开状态时，移动前的位置
    let oldPosition:[number,number] = [0,0] 
    function onMove(state:"start"|"stop",dom:HTMLElement){
        if(state=="start"){
            moving.value = true
            oldPosition = [dom.offsetTop,dom.offsetLeft]
        }
        else if(state=="stop"){
            moving.value = false
            const newPosition:[number,number] = [dom.offsetTop,dom.offsetLeft]
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
    .quickDraftFloatWindow{
        position: absolute;
        color: $antiBgColor;
        background-color: $bgColor;
        border-radius: 10px;
        // box-shadow: 0px 0px 10px 1px $bgColor40;
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
        >.iconContainer{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            .icon{
                width: 80%;
                height: 80%;
            }
        }
    }
    .focusingPage{
       padding: 10px 20px;
    }
</style>