<template>
	<!-- 弹窗影响滑动事件 -->
<div class="mainPage" 
	@touchstart="touchStart" 
	@touchmove="touchMove" 
	@touchend="touchEnd">
		
	<!-- 首页顶部 -->
	<div class="titleBar">
		<Button class="leftPageShowButton" @click="showLeft()" name="显示左侧" icon="showLeft"></Button>
		<div class="projectName" @click="switchProjectPage">{{ projectName }}</div>
		<div class="buttons">
			<Button v-for="(button) in buttons" 
				@click="button.click"
				:name="button.name"
				:icon="button.icon"/>
		</div>
	</div>
	
	<!-- 首页内容 -->
	<div class="mainInner" :key="refreshKey">
		<showInfoOnMainVue :target="showOnMain.target" v-if="showOnMain.type=='info'"/>
		<showArticleOnMainVue :article="showOnMain.target" v-else-if="showOnMain.type == 'article'"/>
		<showExitenceOnMainVue :exitence="showOnMain.target" v-else-if="showOnMain.type == 'exitence'"/>
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
		<!-- 弹窗遮罩层 -->
		<popUpMaskVue></popUpMaskVue>
		<popUpVue :key="popUp.id" v-for="popUp in popUpList" :popUp="popUp"></popUpVue>
	</div>

</div>
</template>

<script setup lang="ts">
import { popUpList, showPopUp } from '@/hooks/pages/popUp'
import { showLeft, switchProjectPage} from '@/hooks/pages/pageChange';
import {touchStart,touchMove,touchEnd } from '@/hooks/pages/mainPage/mainTouch'
import Button from '@/components/global/Button.vue';
import projectPageVue from './projectPage.vue';
import leftPageVue from '@/pages/leftPage.vue';
import rightPageVue from '@/pages/rightPage.vue';
import pageMaskVue from '@/components/mainPage/pageMask.vue';

import inputSupportVue from '@/components/mainPage/inputSupport.vue';
import inputSuggestionVue from '@/components/other/inputSuggestion.vue';

import popUpVue from './popUp.vue';
import popUpMaskVue from '@/components/mainPage/popUpMask.vue'

import showInfoOnMainVue from '@/components/mainPage/showInfoOnMain.vue';
import showArticleOnMainVue from '@/components/mainPage/showArticleOnMain.vue';
import showExitenceOnMainVue from '@/components/mainPage/showExitenceOnMain.vue';

import { showOnMain } from '@/hooks/pages/mainPage/showOnMain';
import { computed, ref, watch } from 'vue';
import { nowProjectInfo } from '@/hooks/project/projectData';
import { saveAll } from '@/hooks/project/saveProject';
import { Icon } from '@/static/list/iconList';

// 功能按键
	const buttons:{icon:Icon,name:string,click:()=>any}[] = [
		{
			name:"手动保存",
			icon:"handSave",
			click:()=>saveAll()
		},
		{
			name:"任务列表",
			icon:"missionList",
			click:()=>{showPopUp({
					name:"任务列表",
					buttons:[],
					vueName:"missionList",
					mask:true,
				})}
		},
		{
			name:"创作日历",
			icon:"canlendar",
			click:()=>showPopUp({
					name:"创作日历",
					buttons:[],
					vueName:"createCanlendar",
					mask:true,
				})
			
		}
	]

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
	.mainPage{
		z-index: 0;
		width: 100vw;
		height: 100vh;
		// 标题栏
		.titleBar{
			position: relative;
			width: 100%;
			height: 110px;
			display: flex;
			box-shadow: rgb(114, 114, 114) 0 4px 8px;
			z-index: 1;
			.leftPageShowButton{
				width: 90px;
			}
			.projectName{
				font-size: 1.1rem;
				display: flex;
				text-align: center;
				align-items: center;
				width: 360px;
			}
			.buttons{
				width: 300px;
				display: flex;
			}
		}
		.mainInner{
			width: calc(100% - 50px);
			height: calc(100% - 110px);
			background-color: $bgColor;
			position: relative;
			margin: 0px 25px;
			overflow: hidden;
			z-index: 0;
		}
		//弹窗容器
		.popUpContainer{
			z-index: 6;
			position: absolute;
			height: 100%;
			width: 100%;
			top:0;
			left:0;
			pointer-events: none;
		}
	}
</style>
