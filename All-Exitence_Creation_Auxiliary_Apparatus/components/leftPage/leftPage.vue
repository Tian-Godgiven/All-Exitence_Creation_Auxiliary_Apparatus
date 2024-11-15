<template>
<view>
	<view class="leftPage" :style="{left:(showWidth-maxWidth)+'px'}">
		<view class="titleBar">
			<view class="titleName" @click="changeModel">{{model?"万物":"文本"}}</view>
			<view class="titleButtons">
				<view class="button" @click="createNew">新建</view>
				<view class="button">管理</view>
				<view class="button">搜索</view>
				<view class="button">展开收起</view>
				<view class="moreButton" @click="showMoreButton">
					<view>
						<view>导入导出</view>
						<view>切换项目</view>
					</view>
				</view>
				
			</view>
		</view>
		
		<view class="inner">
			<scroll-view scroll-y>
				<!-- 万物区 -->
				<allExitenceVue v-show="model"></allExitenceVue>
				<!-- 文本区 -->
				<allArticlesVue v-show="!model"></allArticlesVue>
				<!-- 底部填充区 -->
				<view class="scrollBottom"></view>
			</scroll-view>
		</view>
		
		
	</view>
	<view class="leftPageMask"
		v-show="ifMask" 
		:style="{
			backgroundColor: `rgba(0, 0, 0, ${maskAlpha})`}"
		@click="clickMask"
	>
	</view>
</view>
</template>

<script setup lang="ts" name="LeftPage">
import { leftMaxWidth } from '../../hooks/pageChange';
import allExitenceVue from './all-exitence/all-exitence.vue';
import allArticlesVue from './all-articles/all-articles.vue';
import { ref } from "vue"
import { createType } from '../../hooks/all-exitence/createType';
import { ifMask,maskAlpha,clickMask } from '../../hooks/leftPageMask';

	let {showWidth} = defineProps(["showWidth"])
	let maxWidth = leftMaxWidth
	// true = [万物] false = [文本]
	let model = ref(true)
	function changeModel(){
		model.value = !model.value
	}
	
	function showMoreButton(){
		console.log("显示更多按键")
	}
	
	function createNew(){
		//万物类
		if(model){
			createType()
		}
	}
	
	
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
			@extend .leftPageBigTitleBar;
			.titleButtons{
				.button{
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
	.leftPageMask{
		position: absolute;
		left:0;
		top:0;
		width: 100vw;
		height: 100vh;
		z-index: 1;
	}
</style>