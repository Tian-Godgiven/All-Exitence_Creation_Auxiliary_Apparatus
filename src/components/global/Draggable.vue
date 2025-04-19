<template>
<div class="draggable" ref="dragRef" :class="[
    (dragState.type=='be-dragging-over' && dragState.enter==true) ? 'dragIn':'',
    (dragState.type=='dragging' ? 'dragging':'')
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
    import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine"
	import {draggable,dropTargetForElements} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
	import {type Edge} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
	import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
	import { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview";
    import {
		attachInstruction,
		extractInstruction,
	} from '@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item';
	import { DragState } from '@/api/dragToSort';
    import indicatorVue from "@/components/other/indicator.vue";
    //手柄
    let {handlerRef,getData,level=0} = defineProps<{
        handlerRef?:HTMLElement|null,
        getData:()=>any,
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
		cleanup = combine(
			draggable({
				element:dragRef.value,
				dragHandle:handler,
				//设置初始的data
				getInitialData() {
					return getData()
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
                    if(dragState.value.type != "dragging"){
                        dragState.value = {type:"dragging"}
                    }
					
				},
				onDrop(){
					toDefault()
				}
			}),
			dropTargetForElements({
				element:dragRef.value,
				canDrop({source}){
					if(source.element == dragRef.value){
						return false
					}
					const type = source.data.type
					if(type == "chapter" || type == "article"){
						return true
					}
					return false
				},
				getData({input,element}){
					const data = getData()
					return attachInstruction(data, {
						input,
						element,
						currentLevel: level, //该元素的level
						indentPerLevel: level*20, //该元素的缩进
						mode: 'standard'
					});
				},
				getIsSticky() {
					return true;
				},
				onDragEnter({self,location}){
					if(location.current.dropTargets[0] == self){
						changeState(self)
					}
					//否则默认状态
					else{
						toDefault()
					}
				},
				onDrag({self,location}){
					if(location.current.dropTargets[0] == self){
						//如果状态已经改变了，则不变
						const instruction = extractInstruction(self.data)
						if(!instruction)return
						let edge :Edge|null = null
						if(instruction.type == "reorder-above"){
							edge = "top"
						}
						else if(instruction.type == "reorder-below"){
							edge = "bottom"
						}
						if(dragState.value.type!="be-dragging-over" || dragState.value.edge != edge){
							changeState(self)
						}
					}
					//否则切换回默认状态
					else{
                        toDefault()
                    }
				},
				// 拖离时重置元素状态
				onDragLeave() {
					toDefault()
				},
				onDrop() {
					toDefault()
				},

			})
		)
	})

	onUnmounted(()=>{
		cleanup()
	})

	function changeState(self:any){
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
		dragState.value = { type: "be-dragging-over", enter, edge };
	}
    //设置为初始值
    function toDefault(){
        if(dragState.value != idle){
            dragState.value = idle
        }
    }
</script>

<style scoped lang='scss'>

</style>