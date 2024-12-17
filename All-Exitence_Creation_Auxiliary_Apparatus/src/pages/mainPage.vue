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
				@click="button.click">
				{{button.name}}
			</div>
		</div>
	</div>
	
	<!-- 首页内容 -->
	<div class="mainInner" :key="refreshKey">
		<showArticleVue v-model="showTarget.target" class="container" v-if="showTarget.type == 'article'"/>
		<showExitenceVue v-model="showTarget.target" class="container" v-else-if="showTarget.type == 'exitence'"/>
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
import { popUpList, showPopUp } from '@/hooks/popUp.ts'
import { rightShowWidth,leftShowWidth,touchStart,touchMove,touchEnd,showLeft} from '@/hooks/pageChange';
import leftPageVue from '@/pages/leftPage.vue';
import rightPageVue from '@/pages/rightPage.vue';
import maskVue from '@/components/mainPage/mask.vue';
import inputSupportVue from '@/components/mainPage/inputSupport.vue';
import popUpVue from './popUp.vue';
import inputSuggestionVue from '@/components/other/inputSuggestion.vue';
import showArticleVue from '@/components/mainPage/showArticle.vue';
import showExitenceVue from '@/components/mainPage/showExitence.vue';
import { showTarget } from '@/hooks/showOnMain/showOnMain';
import { provide, ref, watch } from 'vue';

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

// 首页内容栏
	//刷新内容
	let refreshKey = ref(0)
	watch(showTarget,()=>{
		refreshKey.value+=1
	})
	
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
		.mainInner{
			@extend .mainPageInner;
		}
		.popUpContainer{
			@extend .mainPagePopUp
		}
	}
</style>
