<template>
	<expendableContainerVue
		class="type"
		@longTap="longTap"
		:buttons="buttons">
		<template #title>{{ type.name }}</template>
		<template #inner>
			<groupVue v-for="(group) in type.groups" :group="group"></groupVue>
			<div v-for="(exitence,index) in noGroupExitence">
				<exitenceVue :exitence="exitence"></exitenceVue>
				<div class="separator" v-if="index < noGroupExitence.length-1"></div>
			</div>
		</template>
	</expendableContainerVue>
</template>

<script setup lang="ts" name=""> 
import groupVue from "./group.vue"
import exitenceVue from "./exitence.vue"
import { computed, reactive, provide } from "vue";
import { createExitence,createGroup, deleteType, updateType } from "@/hooks/all-exitence/allExitence";
import { showExitenceOnMain } from "@/hooks/pages/mainPage/showOnMain";
import { hidePage } from "@/hooks/pages/pageChange";
import expendableContainerVue from "../expendableContainer.vue";
import { showControlPanel } from "@/hooks/controlPanel";
	let {type} = defineProps(["type"])
	provide("type",type)
	//功能按键
	const buttons = [
		{
			text:"创建分组",
			click:()=>{
				createGroup(type)
			}
		},
		{
			text:"创建事物",
			click:()=>{
				clickCreateExitence()
			}
		}
	]

	// 分类中的事物
	const allExitence = reactive(type.exitence)
	// 获取一个数组对应分类中的事物的index
	const exitenceIndex = computed(()=>{
		return reactive(new Array(allExitence.length).fill(true))
	})
	provide("exitenceIndex",exitenceIndex)
	
	// 没有分组的事物
	let noGroupExitence = computed(()=>{
		const tmp = allExitence.filter((exitence:any,index:number)=>{
			//去除在exitenceIndex中标记为false的
			if(exitenceIndex.value[index]!=false){
				return exitence
			}
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
					updateType(type)}
			},
			{
				text:"删除分类",
				click:()=>{deleteType(type)}
			}
		])
	}
</script>

<style lang="scss" scoped>
@use "@/static/style/leftPage.scss";
	.titleBar{
		@extend .leftPageMidTitleBar;
	}
	.separator{
		@extend .leftPageSeparator;
		
	}
</style>