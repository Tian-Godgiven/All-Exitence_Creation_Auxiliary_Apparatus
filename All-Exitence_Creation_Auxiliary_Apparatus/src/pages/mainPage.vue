<template>
	<!-- 弹窗影响滑动事件 -->
<div class="mainPage" 
	@touchstart="touchStart" 
	@touchmove="touchMove" 
	@touchend="touchEnd">
		
	<!-- 首页顶部 -->
	<div class="titleBar">
		<div class="leftPageShowButton" @click="showLeft()">左侧按键</div>
		<div class="titleName">项目名</div>
		<div class="titleButtons">
			<div v-for="(button) in buttons" 
				class="button" 
				@click="button.click"
			>
				{{button.name}}
			</div>
		</div>
	</div>
	
	<!-- 首页内容 -->
	<div class="inner">
		<div class="container">
			<div class="innerTitle" >
				<textAreaVue
					placeholder="输入标题"
					v-model="textTitle"
					:inputSupport="true">
				</textAreaVue>
			</div>
			<div class="innerText">
				<textAreaVue 
					:inputSuggestionList="keyWordList"
					v-if="innerType == 'article'" 
					v-model="textInner"
					:inputSupport="true"> 
				</textAreaVue>
				<exitenceInnerVue v-if="innerType == 'exitence'" :exitence='textInner'></exitenceInnerVue>
			</div>
		</div>
		<div class="textNum">字数: {{textNum}}</div>
	</div>
	
	<!-- 左侧页面-->
	<leftPageVue :showWidth="leftShowWidth" >
	</leftPageVue>
	
	<!-- 右滑页面 -->
	<rightPageVue :showWidth="rightShowWidth" >
	</rightPageVue>
	
	<!-- 输入辅助栏 -->
	<inputSupportVue></inputSupportVue>
	<!-- 输入提示组件 -->
	<inputSuggestionVue/>
	
	<!-- 弹窗 -->
	<div class="popUpContainer" >
		<!-- 遮罩层 -->
		<maskVue></maskVue>
		<popUpVue v-for="popUp in popUpList" :popUp="popUp"></popUpVue>
	</div>

</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { popUpList, showPopUp } from '@/hooks/popUp.ts'
import { rightShowWidth,leftShowWidth,touchStart,touchMove,touchEnd,showLeft} from '@/hooks/pageChange';
import leftPageVue from '@/pages/leftPage.vue';
import rightPageVue from '@/pages/rightPage.vue';
import exitenceInnerVue from '@/components/mainPage/exitenceInner.vue';
import maskVue from '@/components/mainPage/mask.vue';
import textAreaVue from '@/components/other/textArea/textArea.vue';
import inputSupportVue from '@/components/mainPage/inputSupport.vue';
import popUpVue from './popUp.vue';
import { keyWordList } from '@/data/list/inputSuggestionList/keyWorkList';
import inputSuggestionVue from '@/components/other/inputSuggestion.vue';
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

// 内容栏的内容
	let textTitle = ref("标题测试")
	const 大量内容测试 = '内容'.repeat(1000);
	let textInner = ref(大量内容测试)

	// 内容栏字符数量
	let textNum = ref(0)
	
	textNum.value = textInner.value.length

	let innerType = 'article'
</script>

<style lang="scss" scoped>
	@use "@/static/style/mainPage.scss" as mainPage;
	
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
		.popUpContainer{
			@extend .mainPagePopUp
		}
	}
</style>
