<template>
<div class="mainPage" >
	<!-- 首页顶部 -->
	<div class="top">
		<Button class="leftPageShowButton" @click="showLeft()" name="显示左侧" icon="showLeft"></Button>
		<Button class="projectName" @click="switchProjectPage" :name="projectName"/>
		<div class="buttons">
			<template v-for="button in buttons" :key="button.name">
				<div v-if="button.name === '手动保存'" class="saveAction">
					<Button @click="manualSave" :name="button.name" :icon="button.icon" :disabled="saving"/>
					<Transition name="save-message">
						<span v-if="saveMessage" class="saveMessage" :class="saveMessage.type">{{ saveMessage.text }}</span>
					</Transition>
				</div>
				<Button v-else
					@click="button.click"
					:name="button.name"
					:icon="button.icon"
					:class="{ rightPageToggle: button.name === '辅助功能' }"/>
			</template>
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
	import { computed, onBeforeUnmount, onMounted, reactive, ref, shallowRef, watch } from 'vue';
	import { nowProjectInfo } from '@/hooks/project/project';
	import { saveAll } from '@/hooks/app/autoSave';
	import Suggester from '@/supportAbility/inputSuggestion/suggester/Suggester.vue';
	import QuickButton from '@/app/pages/mainPage/components/quickButton.vue/QuickButton.vue';
import ScrollBar from '@/components/global/ScrollBar.vue';
import MainToolPage from './components/MainToolPage.vue';
import { activeMainToolPage } from '@/hooks/pages/mainPage/toolPage';
import { showPopUp } from '@/hooks/pages/popUp';
import ProjectExportPopUp from '@/export/ProjectExportPopUp.vue';
	import ProjectExportFormatSelector from '@/export/ProjectExportFormatSelector.vue';
// 功能按键
	const buttons = [{
		name:"手动保存",
		icon:"handSave",
		click:manualSave
	},{
		name:"导出作品",
		icon:"export",
		click:()=>openProjectExport()
	},{
		name:"辅助功能",
		icon:"showRight",
		click:()=>showPage("right")	
	}]
	function openProjectExport(){
		const state = reactive({ format: "text" as const })
		showPopUp({ name:"导出作品为", titleVue:shallowRef(ProjectExportFormatSelector), vue:shallowRef(ProjectExportPopUp), props:{ state }, mask:true, buttons:[], size:{ width:"760px", height:"auto" } })
	}

	const saving = ref(false)
	const saveMessage = ref<{ text:string, type:"success"|"failure" }|null>(null)
	let saveMessageTimer: ReturnType<typeof setTimeout> | undefined
	async function manualSave(){
		if(saving.value)return
		saving.value = true
		let succeeded = false
		try{
			succeeded = await saveAll()
		}
		catch(error){
			console.error(error)
		}
		finally{
			saving.value = false
		}
		saveMessage.value = succeeded
			? { text:"保存成功", type:"success" }
			: { text:"保存失败", type:"failure" }
		if(saveMessageTimer) clearTimeout(saveMessageTimer)
		saveMessageTimer = setTimeout(()=>saveMessage.value = null, 2200)
	}
	function handleSaveShortcut(event: KeyboardEvent){
		if(event.isComposing || event.repeat || !(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "s")return
		event.preventDefault()
		void manualSave()
	}
	onMounted(()=>document.addEventListener("keydown", handleSaveShortcut))
	onBeforeUnmount(()=>{
		document.removeEventListener("keydown", handleSaveShortcut)
		if(saveMessageTimer) clearTimeout(saveMessageTimer)
	})

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
		background-color: $bgColor;
		box-shadow: $downShadow;
		overflow: visible;
		z-index: 2;
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
			.saveAction{
				position: relative;
				height: 100%;
			}
			.button{
				box-sizing: border-box;
				height: 100%;
				padding: 15px;
				display: flex;
				align-items: center;
			}
			.saveMessage{
				position: absolute;
				top: calc(100% + 4px);
				left: 50%;
				z-index: 3;
				transform: translateX(-50%);
				white-space: nowrap;
				font-size: $smallFontSize;
				color: $textColor;
				&.failure{ color: $dangerColor; }
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
			background-color: $bgColor;
		}
	}
	
	
}

:global(.save-message-enter-active),
:global(.save-message-leave-active){
	transition: opacity 0.16s ease;
}
:global(.save-message-enter-from),
:global(.save-message-leave-to){ opacity: 0; }

@media (min-width: 900px){
	.mainPage.mainPage{
		.top{
			height: 60px;
			box-shadow: $sidebarToggleShadow;
			.projectName{ padding-left: 24px; font-size: 1.25rem; }
			.buttons{
				width: auto;
				gap: 4px;
				.button{
					width: 48px;
					height: 48px;
					padding: 12px;
				}
				.saveAction{ height: 48px; }
			}
		}
		.mainContentArea{ height: calc(100% - 60px); }
	}
}
</style>
