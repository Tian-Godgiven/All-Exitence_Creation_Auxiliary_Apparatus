<template>
	<!-- 弹窗影响滑动事件 -->
<view class="mainPage" 
	@touchstart="touchStart" 
	@touchmove="touchMove" 
	@touchend="touchEnd">
		
	<!-- 首页顶部 -->
	<view class="titleBar">
		<view class="leftPageShowButton" @click="showLeft()">左侧按键</view>
		<view class="titleName">项目名</view>
		<view class="titleButtons">
			<view v-for="(button,index) in buttons" 
				class="button" 
				@click="button.click"
			>
				{{button.name}}
			</view>
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
	
	
	
	<!-- 弹窗 -->
	<view class="popUpContainer" >
		<!-- 遮罩层 -->
		<maskVue></maskVue>
		<popUpVue v-for="popUp in popUpList" :popUp="popUp"></popUpVue>
	</view>
	

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
import popUpVue from '../../components/mainPage/popUp.vue';
import { popUpList, showPopUp } from '../../hooks/popUp';
// 功能按键
	const buttons = [
		{
			name:"任务列表",
			click:()=>{
				showPopUp({
					name:"任务列表",
					buttons:[],
					vueName:"questionList",
					mask:true,
				})
			}
		},
		{
			name:"创作日历",
			click:()=>{
				showPopUp({
					name:"创作日历",
					buttons:[],
					vueName:"createCanlendar",
					mask:true,
				})
			}
		}
	]

// 控制右侧页面切换按键的位置
	const rpx150 = rpxToPx(150)
	let rightPageHeight = uni.getSystemInfoSync().screenHeight - rpxToPx(550)
	let rightPageButtonNum = (rightPageHeight / rpx150) - 1
	let rightPageSwitchButtonTop = rpxToPx(350) + (rightPageButtonNum * rpx150)
	let textNum = ref(0)
// 内容栏的内容
	const 大量内容测试 = '内容'.repeat(1000);
	const 大量标题测试 = '标题'.repeat(100)
	let textInner = ref(大量内容测试)
	let textTitle = ref("标题测试")
	
	textNum.value = textInner.value.length

	let innerType = 'article'
</script>

<style lang="scss" scoped>
	@import "@/static/style/mainPage.scss";
	
	.mainPage{
		z-index: 0;
		width: 100vw;
		height: 100vh;
		.titleBar{
			@extend .mainPageTitleBar;
		}
		.inner{
			@extend .mainPageInner;
		}
		.rightPageSwitchButton{
			@extend .rightPageSwitchButton;
		}
		.popUpContainer{
			@extend .mainPagePopUp
		}
	}
</style>
