<template>
<div class="rightPage" :style="{right:rightWidth}">
	<div class="top">
		<div class="title">辅助功能</div>
		<div class="buttons"></div>
	</div>
	<AbilityGroup v-for="list,name in abilities" :list :name/>
</div>
</template>

<script setup lang="ts" name="RightPage">
import { rightMaxWidth, rightShowWidth} from '@/hooks/pages/pageChange';
import { computed } from 'vue';
import { rightAbilityList } from '@/static/list/rightAbilityList';
import AbilityGroup from './components/AbilityGroup.vue';
	// 由于右侧页面是从右往左的，因此实际设定的是该页面的right属性
	let rightWidth = computed(()=>{
		return (rightShowWidth.value - rightMaxWidth) +"px"
	})
	
	//功能列表
	let abilities = rightAbilityList
	
</script>

<style lang="scss" scoped>
// 右侧页面
.rightPage{
	position: absolute;
	right: 0;
	top:0;
	width:70vw;
	height: 100%;
	z-index: 5;
	overflow: hidden;
	background-color: $bgColor;
	.top{
		width:100%;
		word-break: break-all;
		background-color: $bgColor;
		height: 110px;
		display: flex;
		position: relative;
		z-index: 1;
		box-sizing: border-box;
		border-bottom: 3px solid $bgColor70;
		.title{
			flex-grow: 1;
			display: flex;
			align-items: center;
			font-weight: 600;
			width: 250px;
			height: 100%;
			font-size: $fontSize60;
		}
		.buttons{
			height: 100%;
			display: flex;
			width: 400px;
			.button{
				width: 100px;
				height: 100%;
				box-sizing: border-box;
			}
		}
	}
}
</style>