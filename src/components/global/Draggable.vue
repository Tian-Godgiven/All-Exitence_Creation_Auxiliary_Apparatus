<template>
<div class="draggable" ref="dragRef" :class="[
    (dragState.type=='be-dragging-over' && dragState.enter==true) ? 'dragIn':'',
    (dragState.type=='dragging' ? 'dragging':'unDragging')
]">
    <slot></slot>
    <indicatorVue v-if="dragState.type === 'be-dragging-over' 
            && dragState.edge!=null" :edge="dragState.edge"
            gap="0px" />
    <!-- 幻影元素 -->
    <Teleport v-if="dragState.type=='preview'" :to="dragState.container">
        <slot name="dragShadow"></slot>
    </Teleport>
</div>

</template>

<script setup lang='ts'>
    import { onMounted, onUnmounted, ref, useTemplateRef } from "vue";
	import { DragState, getCombine } from '@/api/dragToSort';
    import indicatorVue from "@/components/other/indicator.vue";
    import { ElementDragPayload } from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";
    let {handlerRef,getData,canDrop,allowInto=false,level=0} = defineProps<{
        handlerRef?:HTMLElement|null,//手柄
        getData:()=>any,
        canDrop?:(source:ElementDragPayload)=>boolean,//判断是否允许放置的函数
        allowInto?:boolean,//是否允许拖拽进内部
        level?:number//章节需要使用，该章节的层级
    }>()
    //拖拽状态
    const idle:DragState = {type:"idle"}//初始拖拽状态
    const dragState = defineModel<DragState>("dragState",{default:ref<DragState>({type:"idle"})})
    //拖拽功能的实现
	const dragRef = useTemplateRef("dragRef")
    let cleanup = ()=>{}
    onMounted(()=>{
        let handler
        if(dragRef.value == null)return;
        if(!handlerRef){
            handler = dragRef.value
        }
        else{
            handler = handlerRef
        }
        cleanup = getCombine({
            element:dragRef.value,
            dragHandle:handler,
            idle,
            dragState,
            getData,
            canDrop,
            allowInto,
            level
        })
    })

    onUnmounted(()=>{
        cleanup()
    })

	
</script>

<style scoped lang='scss'>
.dragIn{
    box-sizing: border-box;
    border: 5px solid blue;
}
.dragging{
    opacity: 0.5;
}
</style>