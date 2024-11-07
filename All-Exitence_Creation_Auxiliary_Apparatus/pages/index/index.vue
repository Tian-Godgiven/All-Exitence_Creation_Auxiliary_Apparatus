<template>
<view class="full" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
		
	<!-- 首页顶部 -->
	<view class="titleBar">
		<view class="title">
			<button @click="showLeft()">左侧按键</button>
			<view>文件名</view>
		</view>
	</view>
	
	<!-- 首页内容 -->
	<view class="inner">内容</view>
	
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
	
	<!-- 遮罩层 -->
	<view class="mask" v-show="ifMask" :style="{backgroundColor: `rgba(0, 0, 0, ${maskAlpha})`}"></view>

</view>
</template>

<script setup lang="ts">
import { rpxToPx } from '../../api/rpxToPx';
import leftPageVue from '../../components/leftPage/leftPage.vue';
import rightPageVue from '../../components/rightPage/rightPage.vue';
import { ifMask,maskAlpha } from '../../hooks/mask';
import { rightShowWidth,leftShowWidth,touchStart,touchMove,touchEnd,showLeft,switchRight} from '../../hooks/pageChange';
// 控制右侧页面切换按键的位置
const rpx150 = rpxToPx(150)
let rightPageHeight = uni.getSystemInfoSync().screenHeight - rpxToPx(550)
let rightPageButtonNum = (rightPageHeight / rpx150) - 1
let rightPageSwitchButtonTop = rpxToPx(350) + (rightPageButtonNum * rpx150)

</script>

<style lang="scss">
	@import "@/static/style/rightPage.scss";
	
	.full{
		width: 100vw;
		height: 100vh;
	}
	.titleBar{
		width: 100%;
		height: 110rpx;
		display: flex;
		.title{
			width: 70%;
			display: flex;
		}
		.titleButton{
			width: 30%;
			display: flex;
		}
	}
	.inner{
		width: 100%;
		height: calc(100% - 110rpx);
		background-color: lightgoldenrodyellow;
	}
	.rightPageSwitchButton{
		@include rightPageButton;
		position: absolute;
		right:30rpx;
		z-index: 2;
	}
	.mask{
		position: absolute;
		top:0;
		left:0;
		height: 100%;
		width: 100%;
		z-index: 5;
	}
</style>
