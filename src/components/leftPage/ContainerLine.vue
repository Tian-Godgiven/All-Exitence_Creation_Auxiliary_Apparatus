<template>
<Draggable :getData :level :handler :canDrop :allowInto
	ref="draggable" 
    class="container"
	v-model:dragState="dragState">
    <LongTap class="top" :class="expending?'expending':'folding'"
        :style="{paddingLeft:level*10+'px'}"
        :click :longTap >
        <Icon class="icon" :icon="expending?'expand':'unexpand'"></Icon>
        <div class="text">
            <slot name="title"></slot>
        </div>
        <div class="buttons">
            <Button v-for="button in theButtonList" 
                :icon="button.icon"
                :name="button.name"
                @click="button.click">
            </Button>
            <DragHandler v-show="manageMode" ref="handlerRef">
            </DragHandler>
        </div>
    </LongTap>
    <div class="inner" v-show="expending && dragState?.type!='dragging'">
        <slot name="inner"></slot>
    </div>
    <template #dragShadow>
        <slot name="dragShadow"></slot>
    </template>
</Draggable>
</template>

<script setup lang='ts'>
    import { computed, ref, useTemplateRef } from "vue";
    import LongTap from '../other/LongTap.vue';
    import Button from '../global/Button.vue';
    import DragHandler from "@/components/global/DragHandler.vue";
    import { nowLeftManage } from '@/hooks/pages/leftPage';
    import Draggable from "../global/Draggable.vue";
    import { DragState } from "@/api/dragToSort";
    import { ElementDragPayload } from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";
    import Icon from "../global/Icon.vue";

    type buttonItem = {name:string,icon?:string,click:()=>void}
    const {click,longTap,buttonList,expending,getData,level=0,canDrop,allowInto} = defineProps<{
        click:()=>void, //点击事件
        longTap:()=>void, //长按事件
        buttonList:{
            manage:buttonItem[],//管理模式
            unmanage:buttonItem[]//非管理模式
        }, //按钮列表
        expending:boolean//是否展开
        getData:()=>any//获取数据
        level?:number//章节需要使用，该章节的层级
		canDrop?:(source:ElementDragPayload)=>boolean
		allowInto?:boolean
    }>()
    //管理模式
    const manageMode = nowLeftManage
    //使用的按钮列表
    const theButtonList = computed(()=>{
        if(manageMode.value){
            return buttonList.manage
        }
        else{
            return buttonList.unmanage
        }
    })
	//拖拽手柄
    const handlerRef = useTemplateRef("handlerRef")
	const handler = computed(()=>{
        if(handlerRef.value){
            return handlerRef.value.$el
        }
        return null
    })
	//拖拽状态
	const dragState = ref<DragState>({type:"idle"})//拖拽状态

</script>

<style scoped lang='scss'>
.container{
    overflow: hidden;
}
.top {
	width:100%;
	word-break: break-all;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    position: relative;
    
    z-index: 1;
    &.expending{
        box-shadow: $downShadow;
    }
    .icon{
        flex-shrink: 0;
        height: 50px;
        width: 50px;
    }
    .text{
        flex-grow: 1;
        height: 100%;
		width: 100%;
    }
	.buttons{
		height: 100%;
		display: flex;
        align-items: center;
        >div{
            width: 50px;
            height: 100%;
            padding: 0 10px;
        }
	}
}
.inner{
    position: relative;
    z-index: 0;
    width: 100%;
    box-sizing: border-box;
}


</style>