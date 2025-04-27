<template>
<div class="draggableList">
	<DragNode v-for="item,index in list" 
		:key="Symbol()"
		:showHandle :dragHandle
		:item :getData="()=>getData(item)" :canDrop>
		<slot :item :index></slot>
	</DragNode>
</div>
</template>

<script setup lang="ts" name=""> 
	import { onMounted, onUnmounted, toRaw } from 'vue';
    import { ElementDragPayload } from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";
	import { isEqual } from 'lodash';
	import DragNode from './DragNode.vue';
	import { getMonitor } from '@/api/dragToSort';
	const {list,
		showHandle=true,
		dragHandle=false,
	} = defineProps<{
		list:any[],
		showHandle?:boolean,
		dragHandle?:boolean}>()

	function getData(item:any){
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
				console.log(list,targetData)
				return list.indexOf(targetData.item)
			},
			returnNewList:(newList)=>{
				console.log(newList)
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