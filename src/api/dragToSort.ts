import { draggable,dropTargetForElements,ElementDragPayload,monitorForElements} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview';
import { attachClosestEdge, Edge, extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { Ref } from "vue";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine"
import { reorderWithEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge";

export type DragState = {
    type:"idle"
}|{
    type:"dragging",
}|{
    type: "preview"; //预览状态，也就是当正在拖动时的状态
    container: HTMLElement;
}|{
    type: "be-dragging-over"; //其他元素正在经过该元素
    enter: boolean | null;
    edge: Edge | null
}|{
    type: "be-dragging-edge";
    edge: Edge | null
}

/**
 * 该函数仅用于生成拖拽，如需生成拖拽放置排序，请使用getCombine()
 * @param 
 * @returns 
 */
export function getDraggable({
    element,dragHandle,data,idle,dragState,preview=false,onDrop=()=>{}
}:{
    element:HTMLElement,
    dragHandle?:HTMLElement|null,
    data:any,
    idle:DragState,
    dragState:Ref<DragState>,
    preview?:boolean,
    onDrop?:(source:any)=>void
}){
    return draggable({
        element,
		dragHandle:dragHandle??element,
        getInitialData() {
            return data
        },
        onGenerateDragPreview({ nativeSetDragImage }) {
            if(!preview)return;
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
        onDrop({source}){
            dragState.value = idle
            onDrop(source.data)
        }
    })
}

export function getDroppable({
    element,canDrop,getData,idle, dragState,
}:{
    element:HTMLElement,
    canDrop:(source:ElementDragPayload)=>boolean,
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
/**
 * 
 * @param element 可被拖拽的元素.
 * @param dragHandle 拖拽手柄，可选.
 * @param getData 返回初始化元素数据.
 * @param canDrop 允许放置的条件，默认包含禁止放置在自身
 * @param idle 默认状态
 * @param dragState 当前状态，必须是ref
 * @param preview 是否使用自定义预览元素,默认为使用
 * 
 * @returns 
 */
export function getCombine({
    element,dragHandle,getData,canDrop,idle,dragState,preview=true}:{
    element:HTMLElement,
    dragHandle?:HTMLElement,
    getData:()=>Record<string, any>,
    idle:DragState,
    dragState:Ref<DragState>,
    canDrop:(source:ElementDragPayload)=>boolean,
    preview?:boolean
}){
    return combine(
        getDraggable({
            element,
			dragHandle,
			data:getData(),
			idle,
			dragState,
            preview
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

/**
 * 
 * @param canMonitor 允许监听的目标，注意参数为source，需要手动提取data
 * @param sourceIndex 获取放置源的index
 * @param targetIndex 获取放置点的index
 * @param list 重新排序的列表，不要传入响应式
 * @param returnNewList 将重新排序后的列表返回给你，在这里重新赋值响应式最好
 */
export function getMonitor({canMonitor,sourceIndex,targetIndex,list,returnNewList}:{
    canMonitor:(source:ElementDragPayload)=>boolean,
    sourceIndex:(sourceData:Record<string,any>)=>number,
    targetIndex:(targetData:Record<string,any>)=>number,
    list:any[],
    returnNewList:(newList:any[])=>void
}){
    return monitorForElements({
		canMonitor({source}){
			return canMonitor(source)
		},
		onDrop({source,location}){
			// 获得当前的放置目标元素
			const target = location.current.dropTargets[0];
			if (!target) {
				return;
			}
			const targetData = target.data;

			//获取二者的index
			const indexOfSource = sourceIndex(source.data)
			const indexOfTarget = targetIndex(target.data)
			if (indexOfTarget < 0 || indexOfSource < 0) {return}

			// 使用edge来改变位置
			let edge :Edge | null= extractClosestEdge(targetData)
			const newList = reorderWithEdge({
				list: list, //需要被重排的列表
				startIndex: indexOfSource, //移动的元素的index
				indexOfTarget, //被放置的元素的index
				closestEdgeOfTarget:edge, //边界
				axis: "vertical", //排列方式
			});
            returnNewList(newList)
		}	
    })
}