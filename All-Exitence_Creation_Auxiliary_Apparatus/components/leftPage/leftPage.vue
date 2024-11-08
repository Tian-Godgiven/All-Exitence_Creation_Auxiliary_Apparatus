<template>
	<view class="leftPage" :style="{left:(showWidth-maxWidth)+'px'}">
		<view class="titleBar">
			<view class="titleName">{{titleName}}</view>
			<view class="titleButtons">
				<view class="titleButton">搜索</view>
				<view class="titleButton">导入导出</view>
				<view class="titleButton">切换项目</view>
				<view class="titleButton">展开收起</view>
			</view>
		</view>
		
		<view class="inner">
			<scroll-view scroll-y>
				<!-- 万物区 -->
				<allExitenceVue></allExitenceVue>
				<!-- 文本区 -->
				<allArticlesVue></allArticlesVue>
				<!-- 底部填充区 -->
				<view class="scrollBottom"></view>
			</scroll-view>
		</view>
	</view>
</template>

<script setup lang="ts" name="LeftPage">
import { leftMaxWidth } from '../../hooks/pageChange';
import allExitenceVue from './all-exitence/all-exitence.vue';
import allArticlesVue from './all-articles/all-articles.vue';
import { ref } from "vue"
	let {showWidth} = defineProps(["showWidth"])
	let maxWidth = leftMaxWidth
	
	let titleName = ref("项目名称")
</script>

<style lang="scss" scoped>
	@import "@/static/style/leftPage.scss";
	.leftPage{
		top:0;
		height: 100vh;
		width:$leftPageWidth;
		background-color: $leftPageBgColor;
		position: absolute;
		z-index: 5;
		.titleBar{
			display: flex;
			width: 100%;
			height: 110rpx;
			.titleName{
				width: 250rpx;
				height: 100%;
			}
			.titleButtons{
				display: flex;
				width: 400rpx;
				height: 100%;
				.titleButton{
					width: 100rpx;
					height: 100%;
					box-sizing: border-box;
				}
			}
		}
		.inner{
			height: calc(100% - 110rpx);
			scroll-view{
				height: 100%;
				.scrollBottom{
					height: 30%;
				}
			}
		}
	}
</style>