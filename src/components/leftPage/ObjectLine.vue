<template> 
<Draggable :getData :handlerRef :canDrop 
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
            <DragHandler>
                <div ref="handlerRef" v-show="manageMode">拖动</div>
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
    import { useTemplateRef } from "vue";
    import LongTap from '../other/LongTap.vue';
    import Button from '../global/Button.vue';
    import DragHandler from "@/components/global/DragHandler.vue";
    import { nowLeftManage } from '@/hooks/pages/leftPage';
    import Draggable from "../global/Draggable.vue";
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
            height: 100%;
		    display: flex;
        }
    }
}
</style>