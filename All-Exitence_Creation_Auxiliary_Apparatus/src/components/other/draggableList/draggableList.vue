<template>
	<div class="draggableList">
		<draggable :list = "list" 
			itemKey=""
			@start="startDrag" 
			@end="endDrag"
			handle='.dragHandle'>
			<template #item="{ element, index }">
				<div class="dragNode">
					<div class="dragInner">
						<!-- 插槽回传element -->
						<slot class="dragInner" :element="element" :index="index">
							<!-- 默认显示 element 的字符串表示 -->
							<div>{{ element }}</div>
						</slot>
					</div>
					<div class="dragHandle">拖</div>
				</div>
			</template>
		</draggable>
	</div>
</template>

<script setup lang="ts" name=""> 
import draggable from "vuedraggable";
	const {list} = defineProps(["list"])
	const emits = defineEmits(['dragStart','dragEnd'])
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
				width: calc(100% - 50px);
			}
			.dragHandle{
				background-color: lightGray;
				width: 50px;
			}
		}
	}
</style>