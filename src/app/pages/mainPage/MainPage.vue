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
	<ScrollBar class="inner">
	<div class="content" :key="refreshKey">
		<showInfoOnMainVue :target="showOnMain.target" v-if="showOnMain.type=='info'"/>
		<showArticleOnMainVue :article="showOnMain.target" v-else-if="showOnMain.type == 'article'"/>
		<showExitenceOnMainVue :exitence="showOnMain.target" v-else-if="showOnMain.type == 'exitence'"/>
	</div>
	</ScrollBar>
	

	<!-- 快捷键 -->
	<QuickButton/>
	
	<!-- 输入辅助栏 -->
	<inputSupportVue/>
	<!-- 输入提示组件 -->
	<Suggester/>
</div>
</template>

<script setup lang="ts">
	import { showLeft, showPage, switchProjectPage} from '@/hooks/pages/pageChange';
	import Button from '@/components/global/Button.vue';
	import inputSupportVue from '@/app/pages/mainPage/components/inputSupport.vue';
	import showInfoOnMainVue from '@/app/pages/mainPage/components/showInfoOnMain.vue';
	import showArticleOnMainVue from '@/app/pages/mainPage/components/showArticleOnMain.vue';
	import showExitenceOnMainVue from '@/app/pages/mainPage/components/showExitenceOnMain.vue';
	import { showOnMain } from '@/hooks/pages/mainPage/showOnMain';
	import { computed, ref, watch } from 'vue';
	import { nowProjectInfo } from '@/hooks/project/project';
	import { saveAll } from '@/hooks/app/autoSave';
	import Suggester from '@/supportAbility/inputSuggestion/suggester/Suggester.vue';
	import QuickButton from '@/app/pages/mainPage/components/quickButton.vue/QuickButton.vue';
import { callSupportAbility } from '@/hooks/app/app';
import ScrollBar from '@/components/global/ScrollBar.vue';
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
			text-align: center;
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
	.inner{
		height: calc(100% - 110px);
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
</style>
