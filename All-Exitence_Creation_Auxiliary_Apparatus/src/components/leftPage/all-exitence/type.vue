<template>
	<expendableContainerVue
		class="type"
		@longTap="longTap"
		:buttons="buttons">
		<template #title>
			<div class="text">{{ type.name }}</div>
		</template>
		<template #manageMode>
			<div class="button" @click="deleteTypePopUp(type)">删除</div>
			<div class="button dragHandle">拖拽</div>
		</template>
		<template #inner>
			<draggableList :list="type.groups" v-slot="{element:group}">
				<groupVue :key="group.__key" :group="group" :groupExitence="getGroupExitence(group)"></groupVue>
			</draggableList>
			<div v-show="!manageMode" v-for="exitence,index in noGroupExitence">
				<exitenceVue :key="exitence.__key" :exitence="exitence"></exitenceVue>
				<div class="separator" v-if="index < noGroupExitence.length-1"></div>
			</div>
		</template>
	</expendableContainerVue>
</template>

<script setup lang="ts" name=""> 
import groupVue from "./group.vue"
import exitenceVue from "./exitence.vue"
import { computed, provide, inject } from "vue";
import { createExitence,createGroupPopUp, deleteTypePopUp, updateTypePopUp } from "@/hooks/all-exitence/allExitence";
import { showExitenceOnMain } from "@/hooks/pages/mainPage/showOnMain";
import { hidePage } from "@/hooks/pages/pageChange";
import expendableContainerVue from "../expendableContainer.vue";
import { showControlPanel } from "@/hooks/controlPanel";
import draggableList from "@/components/other/draggableList/draggableList.vue";
import { Group } from "@/class/Group";
import { filterExitenceByRule } from "@/hooks/expression/groupRule";
	let {type} = defineProps(["type"])
	provide("type",type)
	//功能按键
	const buttons = [
		{
			text:"创建分组",
			click:()=>{
				createGroupPopUp(type)
			}
		},
		{
			text:"创建事物",
			click:()=>{
				clickCreateExitence()
			}
		}
	]

	//管理模式：不显示事物
	const manageMode = inject("manageMode",false)

	//获取分组中的事物
	function getGroupExitence(group:Group){
		//遍历所有事物，获取满足条件的部分
		const tmp = type.exitence.reduce((arr:any[],exitence:any)=>{
			if(filterExitenceByRule(exitence,group.rules)){
				arr.push(exitence)
			}
			return arr
		},[])
		return tmp
	}
	
	// 没有分组的事物
	let noGroupExitence = computed(()=>{
		//让所有事物分别遍历一次分组规则，返回没有满足任何一个规则的事物数组
		const tmp = type.exitence.filter((exitence:any)=>{
			for(let group of type.groups){
				//满足任意一个分组的事物不要
				if(filterExitenceByRule(exitence,group.rules)){
					return false
				}
			}
			return true
		})
		return tmp
	})
	
	//点击创建事物并显示
	async function clickCreateExitence(){
		const exitence = await createExitence(type)
		hidePage("left")
		showExitenceOnMain(type,exitence)
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
</script>

<style lang="scss" scoped>
@use "@/static/style/leftPage.scss";
	.type{
		>:deep(.titleBar){
			@extend .leftPageMidTitleBar;
		}
	}
	.separator{
		@extend .leftPageSeparator;
	}
</style>