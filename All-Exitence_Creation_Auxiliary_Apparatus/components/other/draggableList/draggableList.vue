<template>
	<view class="draggableList">
		<draggable :list = "list" 
			itemKey=""
			@start="startDrag" 
			@end="endDrag"
			handle='.dragHandle'>
			<template #item="{ element, index }">
				<view class="dragNode">
					<view class="dragInner">
						<!-- 插槽回传element -->
						<slot class="dragInner" :element="element" :index="index">
							<!-- 默认显示 element 的字符串表示 -->
							<view>{{ element }}</view>
						</slot>
					</view>
					<view class="dragHandle">拖</view>
				</view>
			</template>
		</draggable>
	</view>
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
				width: calc(100% - 50rpx);
			}
			.dragHandle{
				background-color: lightGray;
				width: 50rpx;
			}
		}
	}
</style>