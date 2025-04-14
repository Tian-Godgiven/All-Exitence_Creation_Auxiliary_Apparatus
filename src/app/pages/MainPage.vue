<template>
<div class="mainPage" >
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

	<!-- 快捷键 -->
	<Button class="switchButton" 
		:style="{transform: 'rotate(' + rotateDegree + 'deg)'}"
		name="快捷键"
		icon="rightUp"
		@click="switchButton">
	</Button>
	
	<!-- 输入辅助栏 -->
	<inputSupportVue/>
	<!-- 输入提示组件 -->
	<InputSuggestion/>
</div>
</template>

<script setup lang="ts">
	import { showPopUp } from '@/hooks/pages/popUp'
	import { showLeft, switchProjectPage} from '@/hooks/pages/pageChange';
	import Button from '@/components/global/Button.vue';
	import inputSupportVue from '@/components/mainPage/inputSupport.vue';
	import InputSuggestion from '@/supportAbility/inputSuggestion/InputSuggestion.vue';
	import showInfoOnMainVue from '@/components/mainPage/showInfoOnMain.vue';
	import showArticleOnMainVue from '@/components/mainPage/showArticleOnMain.vue';
	import showExitenceOnMainVue from '@/components/mainPage/showExitenceOnMain.vue';
	import { showOnMain } from '@/hooks/pages/mainPage/showOnMain';
	import { computed, ref, watch } from 'vue';
	import { nowProjectInfo } from '@/hooks/project/projectData';
	import { saveAll } from '@/hooks/app/autoSave';
	import { Icon } from '@/static/list/iconList';

// 功能按键
	const buttons:{icon:Icon,name:string,click:()=>any}[] = [{
		name:"手动保存",
		icon:"handSave",
		click:()=>saveAll()
	},{
		name:"任务列表",
		icon:"missionList",
		click:()=>{showPopUp({
			name:"任务列表",
			buttons:[],
			vueName:"missionList",
			mask:true,
		})}
	},{
		name:"创作日历",
		icon:"canlendar",
		click:()=>showPopUp({
			name:"创作日历",
			buttons:[],
			vueName:"createCanlendar",
			mask:true,
		})	
	}]

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
//快捷键
	const rotateDegree = ref(0)//旋转角度
	function switchButton(){
		//旋转按键
		rotateDegree.value += 180
		//功能面板：未完成
	}

</script>

<style lang="scss" scoped>
.mainPage{
	width: 100%;
	height: 100%;
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
	// 内容
	.mainInner{
		width: calc(100% - 50px);
		height: calc(100% - 110px);
		background-color: $bgColor;
		position: relative;
		margin: 0px 25px;
		overflow: hidden;
		z-index: 0;
	}
	// 快捷键
	.switchButton{
		position: absolute;
		right: 9vw;
		top:75vh;
		pointer-events: all;
		height: 110px;
		width: 110px;
		border-radius: 50%;
		background-color: $rightButtonColor;
		box-shadow: 0px 3px 6px 1px rgb(99, 99, 99);
		margin:15px;
		margin-top: 20px;
		z-index: 2;
		flex-shrink: 0;
		transition: transform 0.5s ease;
	}
	
}
</style>
