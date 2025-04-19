<template>
	<div class="type">
		<div class="titleBar" ref="typeRef" 
			:class="[(dragState.type=='dragging' ? 'dragging':'')]">
			<div class="titleButtons" v-show="!manageMode">
				<div class="button" @click="createGroupPopUp(type)">插入分组</div>
				<div class="button" @click="clickCreateExitence">插入事物</div>
			</div>

			<div class="titleButtons manageButtons" v-show="manageMode">
				<div @click="deleteTypePopUp(type)">删除</div>
				<DragHandler>
					<div ref="handlerRef">拖动</div>
				</DragHandler>
			</div>
			
			<LongTap class="titleName" :disabled="manageMode" 
				:longTap = "longTap" :click="()=>switchExpending()">
				<div class="text">{{type.name }}</div>
			</LongTap>
		</div>

		<div class="inner" v-show="expending || manageMode">
			<groupVue v-for="group in type.groups" 
				:key="group.__key" 
				:group="group" 
				:groupExitence="getExitenceInGroup(type.exitence,group)">
			</groupVue>
			<div v-for="exitence,index in showExitence">
				<exitenceVue :key="exitence.__key" :exitence="exitence"></exitenceVue>
				<div class="separator" v-if="index < showExitence.length-1"></div>
			</div>
		</div>

		<indicatorVue v-if="dragState.type === 'be-dragging-edge' 
			&& dragState.edge!=null" :edge="dragState.edge"
			gap="0px" />
	</div>
	<Teleport v-if="dragState.type=='preview'" :to="dragState.container">
		<div class="shadow">{{ type.name }}</div>
	</Teleport>
</template>

<script setup lang="ts" name=""> 
import groupVue from "./group.vue"
import exitenceVue from "./exitence.vue"
import { computed, provide, inject,ref, onMounted, onUnmounted, Ref } from "vue";
import { createExitencePopUp,createGroupPopUp, deleteTypePopUp, getExitenceInGroup, getNoGroupExitence, updateTypePopUp } from "@/hooks/all-exitence/allExitence";
import { showTargetOnMain } from "@/hooks/pages/mainPage/showOnMain";
import { hidePage } from "@/hooks/pages/pageChange";
import { showControlPanel } from "@/hooks/controlPanel";
import { Type } from "@/class/Type";
import LongTap from '@/components/other/LongTap.vue';
import indicatorVue from '@/components/other/indicator.vue';
import { DragState, getCombine } from '@/api/dragToSort';
import DragHandler from "@/components/global/DragHandler.vue";

	let {type} = defineProps<{type:Type}>()
	provide("type",type)

	//切换展开
	const expending = computed(()=>{
		return type.expending
	})
	function switchExpending(){
		type.expending = !expending.value
	}

	//管理模式：不显示分组内的事物，并且显示所有事物
	const manageMode:Ref<boolean> = inject("manageMode",ref(false))
	// 没有分组的事物
	let noGroupExitence = computed(()=>{
		const tmp = getNoGroupExitence(type.exitence,type.groups)
		return tmp
	})
	//显示在页面上的事物
	const showExitence = computed(()=>{
		if(manageMode.value){
			return type.exitence
		}
		else{
			return noGroupExitence.value
		}
	})
	//点击创建事物并显示
	async function clickCreateExitence(){
		const exitence = await createExitencePopUp(type)
		hidePage("left")
		showTargetOnMain({
			type:"exitence",
			target:exitence
		})
	}
	//长按显示控制面板
	function longTap(){
		showControlPanel([
			{
				text:"编辑分类",
				click:()=>{
					updateTypePopUp(type)}
			},
			{
				text:"删除分类",
				click:()=>{deleteTypePopUp(type)}
			}
		])
	}

	//拖动功能的实现
	const typeRef = ref<HTMLElement | null>(null)
	const handlerRef = ref<HTMLElement | null>(null)

	const idle:DragState = {type:"idle"}//初始拖拽状态
	const dragState = ref<DragState>(idle)//拖拽状态
	//获取数据
	function getTypeData(){
		return {
			type:"type",
			__key:type.__key
		}
	}

let cleanup = ()=>{}
onMounted(()=>{
	if(typeRef.value == null || handlerRef.value==null)return;
	cleanup = getCombine({
		element:typeRef.value,
		dragHandle:handlerRef.value,
		idle,
		dragState,
		getData:getTypeData,
		"canDrop":(source)=>{
			return source.data.type == "type"
		},
	})
})

onUnmounted(()=>{
	cleanup()
})

</script>

<style lang="scss" scoped>
@use "@/static/style/components/leftPage.scss";
	.type{
		position: relative;
		.titleBar{
			background-color: $bgColor80;
			height: 70px;
			@extend .titleBar;
			.titleName{
				height: 65px;
				font-size: $midFontSize;
			}
		}
	}
	.separator{
		@extend .leftPageSeparator;
	}
</style>