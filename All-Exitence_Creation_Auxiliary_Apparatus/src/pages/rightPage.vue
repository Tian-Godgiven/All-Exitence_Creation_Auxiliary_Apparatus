<template>
	<div class="rightPage">
		<div class="buttons" :style="{right:showWidth-maxWidth +'px'}">
			<div class="button" v-for="(ability,index) in abilities" :key="index">
				<div>{{ability}}</div>
			</div>
		</div>
		
		<!-- 右侧切换键 -->
		<div class="rightPageSwitchButton" 
			:style="{top:rightPageSwitchButtonTop+'px'}" 
			@click="switchRight()">
		</div>
	</div>
	
</template>

<script setup lang="ts" name="RightPage">
import { rightMaxWidth, switchRight } from '@/hooks/pageChange';
	// 由于右侧页面是从右往左的，因此实际设定的是该页面的right属性
	let {showWidth} = defineProps(["showWidth","maxWidth"])
	const maxWidth = rightMaxWidth
	
	let abilities = ["1","2","3"]
	// 功能按键的数量
	// let rightPageHeight = window.innerHeight - 550
	// let rightPageButtonNum = rightPageHeight / 150

	// 控制右侧页面切换按键的位置
	let rightPageHeight = window.innerHeight - 550
	let rightPageButtonNum = (rightPageHeight / 150) - 1
	let rightPageSwitchButtonTop = 350 + (rightPageButtonNum * 150)
	
	
</script>

<style lang="scss" scoped>
	
	// 右侧页面按键通用样式
	.rightPage{
		pointer-events: none;
		height:calc(100% - 550px);
		right: 0;
		top:350px;
		width:150px;
		background-color: transparent;
		position: absolute;
		z-index: 0;
		overflow: hidden;
	}
	.buttons{
		position: absolute;
		width: 100%;
	}
	.button{
			pointer-events: all;
			height: 100px;
			width: 100px;
			border-radius: 50%;
			background-color: red;
			margin-bottom: 30px;
			z-index: 2;
		}
	
	.rightPageSwitchButton{
		@extend .button;
		position: absolute;
		z-index: 2;
	}
</style>