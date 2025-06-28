<template>
<div class="draggableList">
	<DragNode class="dragNode" v-for="item,index in list" 
		:key="Symbol()"
		:showHandle :dragHandle
		:item 
		:getData="()=>getData(item)" 
		:canDrop>
		<slot :item :index></slot>
	</DragNode>
</div>
</template>

<script setup lang="ts" name="" generic="T"> 
	import { onMounted, onUnmounted, toRaw } from 'vue';
    import { ElementDragPayload } from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";
	import { isEqual } from 'lodash';
	import DragNode from './DragNode.vue';
	import { getMonitor } from '@/api/dragToSort';
	const {list,
		showHandle=true,//控制显示手柄
		dragHandle=false,//是否启用拖动手柄
	} = defineProps<{
		list:T[],
		showHandle?:boolean,
		dragHandle?:boolean}>()

	function getData(item:T){
        return {
			item,
            from:list
        }
    }
    function canDrop(source:ElementDragPayload){
        //source的来源必须一致，都是list
		return isEqual(source.data.from,list)
    }

	//拖动排序方法
	let cleanup = ()=>{}
	onMounted(()=>{
		cleanup = getMonitor({
			canMonitor:(source:ElementDragPayload)=>{
				return source.data.from == list
			},
			list:toRaw(list),
			sourceIndex:(sourceData)=>{
				return list.indexOf(sourceData.item)
			},
			targetIndex:(targetData)=>{
				return list.indexOf(targetData.item)
			},
			returnNewList:(newList)=>{
                Object.assign(list,newList)
            }
		})
	})
	onUnmounted(()=>{
		cleanup()
	})
</script>

<style lang="scss" scoped>
.draggableList{
	position: relative;
	height: 100%;
	width: 100%;
}
</style>