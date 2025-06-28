<template>
<Draggable :getData :handler :canDrop> 
    <div class="dragItem">
        <div class="dragInner">
            <slot></slot>
        </div>
        <DragHandler ref="handlerRef" v-if="dragHandle" v-show="showHandle">
        </DragHandler>
    </div>
    
    <template #dragShadow>
        <slot></slot>
    </template>
</Draggable>
</template>

<script setup lang="ts" name=""> 
    import { computed, useTemplateRef } from 'vue';
    import Draggable from '@/components/global/Draggable.vue'
    import DragHandler from '@/components/global/DragHandler.vue';
import { ElementDragPayload } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';
    
    const {
        getData,
        canDrop,
        showHandle=true,
        dragHandle=false,
    } = defineProps<{
        showHandle?:boolean,
        getData:()=>any,
        canDrop:(source:ElementDragPayload)=>boolean
        dragHandle?:boolean}>()

    //拖拽手柄
    const handlerRef = useTemplateRef("handlerRef")
    const handler = computed(()=>{
        if(handlerRef.value){
            return handlerRef.value.$el
        }
        return null
    })
        
</script>

<style lang="scss" scoped>
.dragItem{
    position: relative;
    display: flex;
    align-items: center;
    .dragInner{
        position: relative;
        max-width: 100%;
        flex-grow: 1; 
        box-sizing: border-box;
    }
    .dragHandler{
        width:auto;
    }
}
</style>