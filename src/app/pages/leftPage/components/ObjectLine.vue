<template> 
<Draggable :getData :handler :canDrop 
    class="objectLine"
    :class="focusing?'focusing':''"
	ref="draggable">
    <LongTap :disabled="manageMode" :click :longTap class="container" :style="{paddingLeft:(level+1)*10+'px'}">
        <div class="inner">
            <slot></slot>
        </div>
        <div class="buttons" v-show="manageMode">
            <Button v-for="button in buttonList" 
                :icon="button.icon"
                :name="button.name"
                @click="button.click">
            </Button>
            <DragHandler ref="handlerRef" v-show="manageMode">
            </DragHandler>
        </div>
    </LongTap>
    <template #dragShadow>
        <slot name="dragShadow"></slot>
    </template>
    <Separator></Separator>
</Draggable>
</template>

<script setup lang='ts'>
    import { computed, useTemplateRef } from "vue";
    import LongTap from "@/components/other/LongTap.vue";
    import Button from "@/components/global/Button.vue";
    import DragHandler from "@/components/global/DragHandler.vue";
    import { nowLeftManage } from '@/hooks/pages/leftPage';
    import Draggable from "@/components/global/Draggable.vue";
    import { ElementDragPayload } from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";
    import Separator from "./Separator.vue";
    type buttonItem = {name:string,icon?:string,click:()=>void}
    const {focusing,click,longTap,buttonList,getData,canDrop,level=0} = defineProps<{
        focusing:boolean//聚焦
        click:()=>void, //点击事件
        longTap:()=>void, //长按事件
        buttonList:buttonItem[], //管理模式按钮列表
        getData:()=>any//获取数据
		canDrop?:(source:ElementDragPayload)=>boolean,
        level?:number
    }>()
    //管理模式
    const manageMode = nowLeftManage
	//拖拽手柄
    const handlerRef = useTemplateRef("handlerRef")
	const handler = computed(()=>{
        if(handlerRef.value){
            return handlerRef.value.$el
        }
        return null
    })
</script>

<style scoped lang='scss'>
.objectLine{
    background-color: $bgColor;
    &.focusing{
        background-color: $focusingColor;
    }
    .container{
        padding: 10px 20px;
        box-sizing: border-box;
        width:100%;
        word-break: break-all;
        display: flex;
        align-items: center;
        .inner{
            flex-grow: 1;
            height: 100%;
            width: 100%;
        } 
        .buttons{
            height: 3em;
            position: relative;
            left:20px;
            display: flex;
            align-items: center;
            >div{
                width: 50px;
                height: 100%;
                padding: 0 10px;
            }
        }
    }
}
</style>