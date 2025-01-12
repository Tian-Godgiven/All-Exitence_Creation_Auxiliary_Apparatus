<template>
	<div class="exitence" ref="exitenceRef">

		<div class="manageButtons" v-show="manageMode">
			<div class="button" @click="clickDeleteExitence($event)">删除</div>
			<div class="button" ref="handlerRef">拖动</div>		
		</div>

		<longTapContainerVue @longtap="longtap" @click="click">
			<div class="name">{{name}}</div>
			<div class="preview">
				<div>{{ preview }}</div>
			</div>
		</longTapContainerVue>
		
		<indicatorVue v-if="dragState.type === 'be-dragging-edge' 
			&& dragState.edge!=null" :edge="dragState.edge"
			gap="0px" />		
	</div>

	<Teleport v-if="dragState.type=='preview'" :to="dragState.container">
		<div class="chapterShadow">{{ exitence.name }}</div>
	</Teleport>
</template>

<script setup lang="ts" name="">
import { hidePage } from '@/hooks/pages/pageChange';
import { showExitenceOnMain } from '@/hooks/pages/mainPage/showOnMain';
import { computed, inject, onMounted, onUnmounted, ref } from 'vue'; 
import longTapContainerVue from '../longTapContainer.vue';
import { showControlPanel } from '@/hooks/controlPanel';
import { deleteExitencePopUp, getExitenceStatusByKey } from '@/hooks/all-exitence/allExitence';
import { translateToTextContent } from '@/hooks/expression/textAreaContent';
import { DragState } from '@/interfaces/dragState';

import indicatorVue from '@/components/other/indicator.vue';
import { getCombine } from '@/api/dragToSort';
import { Exitence } from '@/class/Exitence';

	let {exitence} = defineProps<{exitence:Exitence}>()
	const name = computed(()=>{
		if(exitence.name.trim() == "" || !exitence.name){
			return `未命名${type.name}`
		}
		return exitence.name
	})
	//显示事物的预览内容
	let preview = computed(()=>{
		const key = exitence.setting?.previewStatus
		if(!key){return ""}
		const status = getExitenceStatusByKey(key,exitence.status,type.typeStatus)
		if(!status){return ""}
		if(status.valueType == "tags"){
			let tmp = ""
			for(let tag of status.value){
				tmp += `[${translateToTextContent(tag)}] `
			}
			return tmp
		}
		const tmp = translateToTextContent(status.value)
		return tmp.slice(0,100)
	})
	const type:any = inject("type")

	//管理模式
	const manageMode = inject("manageMode",false)

	function longtap(){
		//显示控制面板
		showControlPanel([{
			text:"删除",
			click:()=>{
				deleteExitencePopUp(type,exitence)
			}
		}])
	}
	function click(){
		//点击将事物显示在主页面
		showExitenceOnMain(type,exitence)
		hidePage("left")
	}

	//点击删除事物
	function clickDeleteExitence(event:Event){
		event.stopPropagation()
		deleteExitencePopUp(type,exitence)
	}
	
//拖拽功能的实现
	const exitenceRef = ref<HTMLElement | null>(null)
	const handlerRef = ref<HTMLElement | null>(null)

	const idle:DragState = {type:"idle"}//初始拖拽状态
	const dragState = ref<DragState>(idle)//拖拽状态
	//获取数据
	function getExitenceData(){
		return {
			type:"exitence",
			from:type,
			__key:exitence.__key
		}
	}

let cleanup = ()=>{}
onMounted(()=>{
	if(exitenceRef.value == null || handlerRef.value==null)return;
	cleanup = getCombine({
		element:exitenceRef.value,
		dragHandle:handlerRef.value,
		idle,
		dragState,
		getData:getExitenceData,
		"canDrop":(source)=>{
			//source的来源必须一致
			if(source.data.from != type){
				return false
			}
			return source.data.type == "exitence"
		},
	})
})

onUnmounted(()=>{
	cleanup()
})
	
	
</script>

<style lang="scss" scoped>
	@use "@/static/style/leftPage.scss";
	.exitence{
		position: relative;
		@extend .leftPageExitence;
		.manageButtons{
			float: right;
			display: flex;
		}
	}
</style>