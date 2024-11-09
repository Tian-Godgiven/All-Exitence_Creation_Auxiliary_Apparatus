<template>
	<view class="rightPage" 
		:style="{right:showWidth-maxWidth +'px'}">
		<view class="button" v-for="(ability,index) in abilities" :key="index">
			<view>{{ability}}</view>
		</view>
	</view>
</template>

<script setup lang="ts" name="RightPage">
import { rpxToPx } from '../../api/rpxToPx';
import { rightMaxWidth } from '@/hooks/pageChange';
	// 由于右侧页面是从右往左的，因此实际设定的是该页面的right属性
	let {showWidth} = defineProps(["showWidth","maxWidth"])
	const maxWidth = rightMaxWidth
	
	let abilities = ["1","2","3"]
	// 功能按键的数量
	let rightPageHeight = uni.getSystemInfoSync().screenHeight - rpxToPx(550)
	let rightPageButtonNum = rightPageHeight / 150
	
</script>

<style lang="scss" scoped>
	@import "@/static/style/rightPage.scss";
	
	.rightPage{
		height:calc(100% - 550rpx);
		top:350rpx;
		width:$rightPageWidth;
		background-color: transparent;
		position: absolute;
		z-index: 1;
	}
	.button{
		@extend .rightPageButton;
	}
</style>