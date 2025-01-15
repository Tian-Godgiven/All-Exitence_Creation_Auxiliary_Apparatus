import {draggable,dropTargetForElements} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview';
import { attachClosestEdge, extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { Ref } from "vue";
import { DragState } from "@/interfaces/dragState";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine"

export function getDraggable({
    element,dragHandle,data,idle,dragState
}:{
    element:HTMLElement,
    dragHandle:HTMLElement|null,
    data:any,
    idle:DragState,
    dragState:Ref<DragState>
}){
    return draggable({
        element,
		dragHandle:dragHandle??element,
        getInitialData() {
            return data
        },
        onGenerateDragPreview({ nativeSetDragImage }) {
            // 自定义预览内容
            setCustomNativeDragPreview({
                nativeSetDragImage,
                getOffset: pointerOutsideOfPreview({
                    x: "16px",
                    y: "8px",
                }),
                render({ container }) {
                    dragState.value = { type: "preview", container };
                },
            });
        },
        onDrag(){
            dragState.value = {type:"dragging"}
        },
        onDrop(){
            dragState.value = idle
        }
    })
}

export function getDroppable({
    element,canDrop,getData,idle, dragState,
}:{
    element:HTMLElement,
    canDrop:(source:any)=>boolean,
    getData:()=>Record<string, any>,
    idle:DragState,
    dragState:Ref<DragState>,
}){
    return dropTargetForElements({
        element,
        canDrop({source}){
            if(source.element == element){
                return false
            }
            return canDrop(source)
        },
        //不允许被进入，返回最近边缘
        getData({input,element}){
            const data = getData()
            return attachClosestEdge(
                data,{
                    element,
                    input,
                    allowedEdges:['bottom','top']
                }
            )
        },
        getIsSticky() {
            return true;
        },
        onDragEnter({self}){
            const edge = extractClosestEdge(self.data)
            if(!edge)return
            // 修改该元素的状态为:正在被拖过边缘，会显示提示线条，并设置其所处的边界（上or下
            dragState.value = { type: "be-dragging-edge", edge };
        },
        onDrag({self}){
            //如果状态已经改变了，则不变
            const edge = extractClosestEdge(self.data)
            if(edge && (dragState.value.type!="be-dragging-edge" || dragState.value.edge != edge)){
                // 修改该元素的状态为:正在被拖过边缘，会显示提示线条，并设置其所处的边界（上or下
                dragState.value = { type: "be-dragging-edge", edge };
            }
        },
        // 拖离时重置元素状态
        onDragLeave() {
            dragState.value = idle
        },
        onDrop() {
            dragState.value = idle
        },
    })
}

export function getCombine({
    element,dragHandle,getData,canDrop,idle,dragState,}:{
    element:HTMLElement,
    dragHandle:HTMLElement,
    getData:()=>Record<string, any>,
    idle:DragState,
    dragState:Ref<DragState>,
    canDrop:(source:any)=>boolean
}){
    return combine(
        getDraggable({
            element,
			dragHandle,
			data:getData(),
			idle,
			dragState
        }),
        getDroppable({
            element,
			getData,
		    canDrop,
			idle,
			dragState
        })
    )
}