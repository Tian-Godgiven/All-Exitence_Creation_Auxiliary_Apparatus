<template>
	<div class="draggableList">
		<draggable 
			:list = "list" 
			itemKey=""
			@start="startDrag" 
			@end="endDrag"
			handle='.dragHandle'>
			<template #item="{ element, index }">
				<div class="dragNode">
					<div class="dragInner">
						<!-- 插槽回传element -->
						<slot :class="dragHandle??'fullInner'" class="dragInner" :element="element" :index="index">
							<!-- 默认显示 element 的字符串表示 -->
							<div>{{ element }}</div>
						</slot>
					</div>
					<div class="dragHandle" v-if="dragHandle" v-show="showHandle==true">拖</div>
				</div>
			</template>
		</draggable>
	</div>
</template>

<script setup lang="ts" name=""> 
import draggable from "vuedraggable";
	const {list,showHandle=true,dragHandle=false} = defineProps(["list","showHandle","dragHandle"])
	const emits = defineEmits(['dragStart','dragEnd'])
	//控制是否显示Handle
	function startDrag(){
		emits("dragStart",list)
	}
	function endDrag(){
		emits("dragEnd",list)
	}
</script>

<style lang="scss" scoped>
	.draggableList{
		width: 100%;
		.dragNode{
			width: 100%;
			display: flex;
			.dragInner{
				max-width: 100%;
				flex-grow: 1; 
			}
			.dragHandle{
				background-color: lightGray;
				width: 50px;
			}
		}
	}
</style>