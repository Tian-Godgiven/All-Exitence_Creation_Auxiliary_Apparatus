<template>
<div class="all-exitence">
	<typeVue v-for="type in nowTypes" 
		:key="type.__key" 
		:type="type"/>
</div>
</template>

<script setup lang="ts" name=""> 
	import { computed,onMounted,onUnmounted } from 'vue';
	import typeVue from './type.vue';
	import { nowAllExitence } from '@/hooks/all-exitence/allExitence';
	import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
	import { extractClosestEdge, type Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
	import { reorderWithEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge";
	import { Type } from '@/class/Type';

		const nowTypes = computed(()=>{
			return nowAllExitence.types
		})

		let cleanup = ()=>{}
	onMounted(()=>{
		cleanup = monitorForElements({
			canMonitor({source}){
				const type = source.data.type as string
				if(['type','group','exitence'].includes(type)){
					return true;
				}
				return false
			},
			onDrop({source,location}){
				// 获得当前的放置目标元素
				const target = location.current.dropTargets[0];
				if (!target) {
					return;
				}
				
				// 获得拖动并放置了的元素
				const sourceData = source.data;
				const targetData = target.data;
				//要求两者的类型相同
				const sourceType = sourceData.type as string
				if(targetData.type != sourceType)return

				//找到来源的对象，二者应当处于同一来源
				let from :any
				let keyWord : string
				if(sourceType == 'type'){
					from = nowAllExitence
					keyWord = "types"
				}
				else if(sourceType == "group"){
					from = sourceData.from as Type
					keyWord = "groups"
				}
				else if(sourceType == "exitence"){
					from = sourceData.from as Type
					keyWord = "exitence"
				}
				else{
					console.error("错误的类型:",sourceType)
					return;
				}

				//再获取二者的index
				const indexOfSource = from[keyWord].findIndex(
					(object:any) => object.__key === sourceData.__key
				);
				const indexOfTarget = from[keyWord].findIndex(
					(object:any) => object.__key === targetData.__key
				);
				if (indexOfTarget < 0 || indexOfSource < 0) {return}

				// 使用edge来改变位置
				let edge :Edge | null= extractClosestEdge(targetData)
				from[keyWord] = reorderWithEdge({
					list: from[keyWord], //需要被重排的列表
					startIndex: indexOfSource, //移动的元素的index
					indexOfTarget, //被放置的元素的index
					closestEdgeOfTarget:edge, //边界
					axis: "vertical", //排列方式
				});
			}	
		})
	})
	onUnmounted(()=>{
		cleanup()
	})

</script>

<style lang="scss" scoped>
.all-exitence{
	position: relative;
	width: 100%;
}
</style>