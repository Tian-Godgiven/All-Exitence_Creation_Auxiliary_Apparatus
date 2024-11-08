<template>
<view class="mainPage" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
		
	<!-- 首页顶部 -->
	<view class="titleBar">
		<view class="leftPageShowButton" @click="showLeft()">左侧按键</view>
		<view class="titleName">项目名</view>
		<view class="titleButtons">
			<view>任务</view>
			<view>日历</view>
			<view>设置</view>
		</view>
	</view>
	
	<!-- 首页内容 -->
	<view class="inner">
		<scroll-view scroll-y>
			<view class="innerTitle">
				<textarea 
					@focus="showInputSupport" 
					@blur="hideInputSupport" 
					auto-height 
					:value="textTitle" 
					maxlength="-1" 
					hold-keyboard>
				</textarea>
			</view>
			<view class="innerText">
				<textarea 
					@focus="showInputSupport" 
					@blur="hideInputSupport" 
					v-if="innerType == 'article'" 
					auto-height 
					:value="textInner" 
					maxlength="-1" 
					hold-keyboard>
				</textarea>
				<exitenceInnerVue v-if="innerType == 'exitence'" :exitence='textInner'></exitenceInnerVue>
			</view>
			
		</scroll-view>
		<view class="textNum">字数: {{textNum}}</view>
	</view>
	
	<!-- 右侧切换键 -->
	<view class="rightPageSwitchButton" 
		:style="{top:rightPageSwitchButtonTop+'px'}" 
		@click="switchRight()">
	</view>
	
	<!-- 左侧页面-->
	<leftPageVue :showWidth="leftShowWidth" >
	</leftPageVue>
	
	<!-- 右滑页面 -->
	<rightPageVue :showWidth="rightShowWidth" >
	</rightPageVue>
	
	<!-- 创作辅助栏 -->
	<inputSupportVue v-show="inputSupportShowing"></inputSupportVue>
	
	<!-- 遮罩层 -->
	<maskVue></maskVue>
	
	

</view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { rpxToPx } from '../../api/rpxToPx';
import { rightShowWidth,leftShowWidth,touchStart,touchMove,touchEnd,showLeft,switchRight} from '../../hooks/pageChange';
import leftPageVue from '../../components/leftPage/leftPage.vue';
import rightPageVue from '../../components/rightPage/rightPage.vue';
import exitenceInnerVue from '../../components/mainPage/exitenceInner.vue';
import maskVue from '../../components/mainPage/mask.vue';
import { hideInputSupport, inputSupportShowing, showInputSupport } from '../../hooks/inputSupport';
import inputSupportVue from '../../components/mainPage/inputSupport.vue';
	// 控制右侧页面切换按键的位置
	const rpx150 = rpxToPx(150)
	let rightPageHeight = uni.getSystemInfoSync().screenHeight - rpxToPx(550)
	let rightPageButtonNum = (rightPageHeight / rpx150) - 1
	let rightPageSwitchButtonTop = rpxToPx(350) + (rightPageButtonNum * rpx150)
	let textNum = ref(0)

	const 大量内容测试 = '内容'.repeat(1000);
	const 大量标题测试 = '标题'.repeat(100)
	let textInner = ref(大量内容测试)
	let textTitle = ref("标题测试")
	
	textNum.value = textInner.value.length

	let innerType = 'article'
</script>

<style lang="scss" scoped>
	@import "@/static/style/rightPage.scss";
	@import "@/static/style/global.scss";
	
	.mainPage{
		z-index: 0;
		width: 100vw;
		height: 100vh;
	}
	.titleBar{
		width: 100%;
		height: 110rpx;
		display: flex;
		.leftPageShowButton{
			width: 100rpx;
		}
		.titleName{
			width: 425rpx;
		}
		.titleButtons{
			width: 225rpx;
			display: flex;
			view{
				width: 75rpx;
			}
		}
	}
	.inner{
		width: calc(100% - 50rpx);
		height: calc(100% - 110rpx);
		background-color: $bgColor;
		position: relative;
		margin: 0rpx 25rpx;
		overflow: hidden;
		scroll-view{
			width: 100%;
			height: 100%;
			.innerTitle{
				min-height: 70rpx;
				width: 100%;
				position: relative;
				padding-top:40rpx;
				font-weight: bold;
				display: flex;
				align-items: center;
				justify-content: center;
				word-break: break-all;
				word-wrap: break-word;
				font-size: $innerTitleFontSize;
				color: $textColor;
				text-align: center;
			}
			.innerText{
				min-height: calc(100% - 110rpx);
				width: 100%;
				position: relative;
				*{
					overflow:visible !important;
				}
				textarea{
					min-height: 100%;
					width: 100%;
				}
			}
		}
		.textNum{
			position: absolute;
			display: flex;
			align-items: center;
			justify-content: center;
			top:0rpx;
			right:0rpx;
			padding: 5rpx 12rpx;
			border-top-left-radius: 50px;  /* 左上角圆角 */
			border-top-right-radius: 50px; /* 右上角圆角 */
			border-bottom-left-radius: 50px; /* 左下角圆角 */
			border-bottom-right-radius: 50px; /* 右下角圆角 */
			background-color: $textNumColor;
			height: 30rpx;
			font-size: 25rpx;
			text-align: center;
			z-index: 2;
		}
	}
	.rightPageSwitchButton{
		@include rightPageButton;
		position: absolute;
		right:30rpx;
		z-index: 2;
	}
	
</style>
