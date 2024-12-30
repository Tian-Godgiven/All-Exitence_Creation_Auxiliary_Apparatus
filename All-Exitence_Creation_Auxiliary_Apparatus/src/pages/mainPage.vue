<template>
	<!-- 弹窗影响滑动事件 -->
<div class="mainPage" 
	@touchstart="touchStart" 
	@touchmove="touchMove" 
	@touchend="touchEnd">
		
	<!-- 首页顶部 -->
	<div class="titleBar">
		<div class="leftPageShowButton" @click="showLeft()">左侧按键</div>
		<div class="titleName" @click="switchProjectPage">{{ projectName }}</div>
		<div @click="clickSaveProject">手动保存</div>
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
		<showInfoVue :target="showOnMain.target" v-if="showOnMain.type=='info'"></showInfoVue>
		<showArticleVue :article="showOnMain.target" v-else-if="showOnMain.type == 'article'"/>
		<showExitenceVue :exitence="showOnMain.target" v-else-if="showOnMain.type == 'exitence'"/>
	</div>

	<!-- 项目页面 -->
	<projectPageVue/>
	<!-- 左侧页面-->
	<leftPageVue/>
	<!-- 右滑页面 -->
	<rightPageVue/>
	
	<!-- 输入辅助栏 -->
	<inputSupportVue/>
	<!-- 输入提示组件 -->
	<inputSuggestionVue/>

	<!-- 页面遮罩层 -->
	<pageMaskVue/>
	
	<!-- 弹窗 -->
	<div class="popUpContainer" >
		<!-- 遮罩层 -->
		<popUpMaskVue></popUpMaskVue>
		<popUpVue v-for="popUp in popUpList" :popUp="popUp"></popUpVue>
	</div>

</div>
</template>

<script setup lang="ts">
import { popUpList, showPopUp } from '@/hooks/pages/popUp'
import { showLeft, switchProjectPage} from '@/hooks/pages/pageChange';
import {touchStart,touchMove,touchEnd } from '@/hooks/pages/mainPage/mainTouch'

import projectPageVue from './projectPage.vue';
import leftPageVue from '@/pages/leftPage.vue';
import rightPageVue from '@/pages/rightPage.vue';
import pageMaskVue from '@/components/mainPage/pageMask.vue';

import inputSupportVue from '@/components/mainPage/inputSupport.vue';
import inputSuggestionVue from '@/components/other/inputSuggestion.vue';

import popUpVue from './popUp.vue';
import popUpMaskVue from '@/components/mainPage/popUpMask.vue'

import showInfoVue from '@/components/mainPage/showInfo.vue';
import showArticleVue from '@/components/mainPage/showArticle.vue';
import showExitenceVue from '@/components/mainPage/showExitence.vue';

import { showOnMain } from '@/hooks/pages/mainPage/showOnMain';
import { computed, ref, watch } from 'vue';
import { nowProjectInfo } from '@/hooks/project/projectData';
import { saveAll } from '@/hooks/project/saveProject';

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
	//手动保存项目
	function clickSaveProject(){
		saveAll()
	}

// 首页内容栏
	//项目名称
	const projectName = computed(()=>{
		return nowProjectInfo?.name
	})
	//刷新内容
	let refreshKey = ref(0)
	watch(showOnMain,()=>{
		refreshKey.value+=1
	},{
		deep:false
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
