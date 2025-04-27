import { draggable,dropTargetForElements,ElementDragPayload,monitorForElements} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview';
import { attachClosestEdge, Edge, extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { Ref } from "vue";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine"
import { reorderWithEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge";
import {
    attachInstruction,
    extractInstruction,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item';
import { isEqual } from "lodash";

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
    type: "be-dragging-edge"; //其他元素正在经过该元素的边缘
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
                    setDragState(dragState,{ type: "preview", container })
                },
            });
        },
        onDrag(){
            if(dragState.value.type != "dragging"){
                setDragState(dragState,{type:"dragging"})
            }
        },
        onDrop({source}){
            setDragState(dragState,idle)
            onDrop(source.data)
        }
        
    })
}

export function getDroppable({
    element,canDrop,getData,idle, dragState,allowInto=false,level=0
}:{
    element:HTMLElement,
    canDrop:(source:ElementDragPayload)=>boolean,
    getData:()=>Record<string, any>,
    idle:DragState,
    dragState:Ref<DragState>,
    allowInto?:boolean//是否允许其他元素放入其中
    level?:number//阶层
}){
    return dropTargetForElements({
        element,
        canDrop({source}){
            if(source.element == element){
                return false
            }
            return canDrop(source)
        },
        getData({input,element}){
            const data = getData()
            //不允许被进入，返回最近边缘
            if(!allowInto){
                return attachClosestEdge(data,{
                    element,
                    input,
                    allowedEdges:['bottom','top']
                })
            }
            //允许被进入，要求传入level
            else{
                return attachInstruction(data, {
                    input,
                    element,
                    currentLevel: level, //该元素的level
                    indentPerLevel: level*20, //该元素的缩进
                    mode: 'standard'
                });
            }
        },
        getIsSticky() {
            return true;
        },
        onDragEnter({self,location}){
            //允许被进入
            if(allowInto){
                if(location.current.dropTargets[0] == self){
                    changeState(self,dragState)
                }
                //否则默认状态
                else{
                    setDragState(dragState,idle)
                }
            }
            else{
                const edge = extractClosestEdge(self.data)
                if(!edge)return
                // 修改该元素的状态为:正在被拖过边缘，会显示提示线条，并设置其所处的边界（上or下
                setDragState(dragState,{ type: "be-dragging-edge", edge })
            }
            
        },
        onDrag({self,location}){
            //允许被进入
            if(allowInto){
                if(location.current.dropTargets[0] == self){
                    changeState(self,dragState)
                    return;
                }
                setDragState(dragState,idle)
            }
            else{
                const edge = extractClosestEdge(self.data)
                if(!edge)return;
                // 修改该元素的状态为:正在被拖过边缘，会显示提示线条，并设置其所处的边界（上or下
                setDragState(dragState,{ type: "be-dragging-edge", edge })
            }
        },
        // 拖离时重置元素状态
        onDragLeave() {
            setDragState(dragState,idle)
        },
        onDrop() {
            setDragState(dragState,idle)
        },
    })
}
/**
 * 获取一个可以被拖拽也可以被其他元素放置从而调整顺序的元素
 * @param element 可被拖拽的元素.
 * @param dragHandle 拖拽手柄，可选.
 * @param getData 返回初始化元素数据.
 * @param canDrop 允许放置的条件，禁止放置在自身，默认无条件
 * @param idle 默认状态
 * @param dragState 当前状态，必须是ref
 * @param preview 是否使用自定义预览元素,默认为使用
 * @param allowInto?:boolean,是否允许拖拽进内部
 * @param level?:number,对象的层级（allowInto为true)
 * @returns 一个清理函数，在销毁组件时调用
 */
export function getCombine({
    element,dragHandle,getData,canDrop=()=>true,idle,dragState,preview=true,allowInto=false,level=0}:{
    element:HTMLElement,
    dragHandle?:HTMLElement,
    getData:()=>Record<string, any>,
    idle:DragState,
    dragState:Ref<DragState>,
    canDrop?:(source:ElementDragPayload)=>boolean,
    preview?:boolean,
    allowInto?:boolean,
    level?:number
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
			dragState,
            allowInto,
            level
        })
    )
}

/**
 * 快速创建监听器，用于监听拖拽事件
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

//设置拖拽状态
function setDragState(dragState:Ref<DragState>,state:DragState){
    if(!isEqual(dragState.value,state)){
        dragState.value = state
    }
}
//允许被进入的修改状态
function changeState(self:any,dragState:Ref<DragState>){
    // self为该元素的简易数据
    const instruction = extractInstruction(self.data)
    if(!instruction)return
    let edge:Edge|null = null
    let enter : boolean|null = false
    if(instruction.type == "reorder-above"){
        edge = "top"
    }
    else if(instruction.type == "reorder-below"){
        edge = "bottom"
    }
    else if(instruction.type == "make-child"){
        enter = true
    }
    else{
        return null
    }
    // 修改该元素的状态为:正在被拖入，会显示提示线条，并设置其所处的边界（上or下
    setDragState(dragState,{ type: "be-dragging-over", enter, edge })
}