<template>
<div class="mainPage" >
	<!-- 首页顶部 -->
	<div class="top">
		<Button class="leftPageShowButton" @click="showLeft()" name="显示左侧" icon="showLeft"></Button>
		<Button class="projectName" @click="switchProjectPage" :name="projectName"/>
		<div class="buttons">
			<Button v-for="(button) in buttons" 
				@click="button.click"
				:name="button.name"
				:icon="button.icon"/>
		</div>
	</div>
	
	<!-- 首页内容 -->
	<div class="mainContentArea">
		<ScrollBar class="inner">
			<div class="content" :key="refreshKey">
				<showInfoOnMainVue :target="showOnMain.target" v-if="showOnMain.type=='info'"/>
				<showArticleOnMainVue :article="showOnMain.target" v-else-if="showOnMain.type == 'article'"/>
				<showTypeOnMainVue :type="showOnMain.target" v-else-if="showOnMain.type == 'type'"/>
				<showExitenceOnMainVue :exitence="showOnMain.target" v-else-if="showOnMain.type == 'exitence'"/>
			</div>
		</ScrollBar>
		<MainToolPage v-if="activeMainToolPage" :toolPage="activeMainToolPage" />
	</div>
	

	<!-- 快捷键 -->
	<QuickButton v-if="!activeMainToolPage"/>
	
	<!-- 输入辅助栏 -->
	<!-- <inputSupportVue/> -->
	<!-- 输入提示组件 -->
	<Suggester v-if="!activeMainToolPage"/>
</div>
</template>

<script setup lang="ts">
	import { showLeft, showPage, switchProjectPage} from '@/hooks/pages/pageChange';
	import Button from '@/components/global/button.vue';
	// import inputSupportVue from '@/app/pages/mainPage/components/inputSupport.vue';
	// 待完成
	import showInfoOnMainVue from '@/app/pages/mainPage/components/showInfoOnMain.vue';
	import showArticleOnMainVue from '@/app/pages/mainPage/components/showArticleOnMain.vue';
	import showTypeOnMainVue from '@/app/pages/mainPage/components/showTypeOnMain.vue';
	import showExitenceOnMainVue from '@/app/pages/mainPage/components/showExitenceOnMain.vue';
	import { showOnMain } from '@/hooks/pages/mainPage/showOnMain';
	import { computed, ref, watch } from 'vue';
	import { nowProjectInfo } from '@/hooks/project/project';
	import { saveAll } from '@/hooks/app/autoSave';
	import Suggester from '@/supportAbility/inputSuggestion/suggester/Suggester.vue';
	import QuickButton from '@/app/pages/mainPage/components/quickButton.vue/QuickButton.vue';
import { callSupportAbility } from '@/hooks/app/app';
import ScrollBar from '@/components/global/ScrollBar.vue';
import MainToolPage from './components/MainToolPage.vue';
import { activeMainToolPage } from '@/hooks/pages/mainPage/toolPage';
// 功能按键
	const buttons = [{
		name:"手动保存",
		icon:"handSave",
		click:()=>saveAll()
	},{
		name:"任务列表",
		icon:"missionList",
		click:()=>{callSupportAbility("missionList")}
	},{
		name:"辅助功能",
		icon:"showRight",
		click:()=>showPage("right")	
	}]

// 首页内容栏
	//项目名称
	const projectName = computed(()=>{
		return nowProjectInfo?.name
	})
	//刷新内容
	let refreshKey = ref(0)
	watch(()=>showOnMain.target,()=>{
		refreshKey.value+=1
	})
	

</script>

<style lang="scss" scoped>
@media (min-width: 900px){
	.mainPage{
		margin-left: 320px;
		width: calc(100% - 320px) !important;
		.top .leftPageShowButton{ display: none; }
	}
}
.mainPage{
	width: 100%;
	height: 100%;
	// 标题栏
	.top{
		position: relative;
		width: 100%;
		height: 110px;
		display: flex;
		box-shadow: $downShadow;
		z-index: 1;
		.leftPageShowButton{
			width: 90px;
		}
		.projectName{
			font-size: 1.1rem;
			display: flex;
			text-align: left;
			justify-content: flex-start;
			align-items: center;
			flex-grow: 1;
		}
		.buttons{
			margin-right: 20px;
			height: 100%;
			width: 250px;
			display: flex;
			align-items: center;
			.button{
				box-sizing: border-box;
				height: 100%;
				padding: 15px;
				display: flex;
				align-items: center;
			}
		}
	}
	// 内容
	.mainContentArea{
		height: calc(100% - 110px);
		position: relative;
		overflow: hidden;
	}
	.inner{
		height: 100%;
		background-color: $bgColor;
		box-sizing: border-box;
		position: relative;
		overflow: hidden;
		padding: 0 25px;
		z-index: 0;
		.content{
			padding-top: 21px;
		}
	}
	
	
}

@media (min-width: 900px){
	.mainPage.mainPage{
		.top{
			height: 60px;
			box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
			.projectName{ padding-left: 24px; font-size: 1.25rem; }
			.buttons{
				width: auto;
				gap: 4px;
				.button{
					width: 48px;
					height: 48px;
					padding: 12px;
				}
			}
		}
		.mainContentArea{ height: calc(100% - 60px); }
	}
}
</style>
