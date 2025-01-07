<template>
	<expendableContainerVue
		class="group"
		:buttons="buttons"
		@longTap="longTap">
		<template #title>
			<div class="text">{{ group.name }}</div>
		</template>
		<template #inner>
			<div v-for="(exitence,index) in groupExitence">
				<exitenceVue :exitence="exitence"></exitenceVue>
				<div class="separator" v-if="index < groupExitence.length-1"></div>
			</div>
		</template>
	</expendableContainerVue>
</template>

<script setup lang="ts" name=""> 
import { inject, computed } from 'vue';
import exitenceVue from './exitence.vue';
import { deleteGroup, updateGroupPopUp } from '@/hooks/all-exitence/allExitence';
import { filterExitenceByRule } from '@/hooks/expression/groupRule';
import expendableContainerVue from '../expendableContainer.vue';
import { showControlPanel } from '@/hooks/controlPanel';
	
	let {group} = defineProps(["group","exitenceIndex"]) 
	const exitenceIndex = inject<any>("exitenceIndex")
	const type = inject<any>("type")

	const buttons = [{
		text:"编辑",
		click:()=>{updateGroupPopUp(type,group)}
	}]

	// 分组中的事物
	const groupExitence = computed(()=>{
		//遍历所有事物
		const tmp = type.exitence.reduce((arr:any[],exitence:any,index:number)=>{
			if(filterExitenceByRule(exitence,group.rules)){
				//去除这个index
				exitenceIndex.value[index] = false
				arr.push(exitence)
			}
			else{
				exitenceIndex.value[index] = true
			}
			return arr
		},[])
		return tmp
	})

	// 长按显示控制面板
	function longTap(){
		showControlPanel([
			{
				text:"编辑分组",
				click:()=>{
					updateGroupPopUp(type,group)
				}
			},
			{
				text:"删除分组",
				click:()=>{
					deleteGroup(type,group)
				}
			}
		])
	}

</script>

<style lang="scss" scoped>
@use "@/static/style/leftPage.scss";
@use "@/static/style/global.scss" as global;
	.group{
		border: global.$antiBgColor 5px solid;
		:deep(.titleBar){
			@extend .leftPageGroup;
		}
	}
	.separator{
		@extend .leftPageSeparator;
	}
</style>