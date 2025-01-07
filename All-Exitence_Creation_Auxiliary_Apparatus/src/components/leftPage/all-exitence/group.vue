<template>
	<expendableContainerVue
		class="group"
		:buttons="buttons"
		@longTap="longTap">
		<template #title>
			<div class="text">{{ group.name }}</div>
		</template>
		<template #manageMode>
			<div class="button" @click="deleteGroup(type,group)">删除</div>
			<div class="button dragHandle">拖拽</div>
		</template>
		<template #inner>
			<div v-show="!manageMode" v-for="(exitence,index) in groupExitence">
				<exitenceVue :exitence="exitence"></exitenceVue>
				<div class="separator" v-if="index < groupExitence.length-1"></div>
			</div>
		</template>
	</expendableContainerVue>
</template>

<script setup lang="ts" name=""> 
import { inject } from 'vue';
import exitenceVue from './exitence.vue';
import { deleteGroup, updateGroupPopUp } from '@/hooks/all-exitence/allExitence';
import expendableContainerVue from '../expendableContainer.vue';
import { showControlPanel } from '@/hooks/controlPanel';
	
	let {group,groupExitence} = defineProps(["group","groupExitence"]) 
	const type = inject<any>("type")

	const manageMode = inject("manageMode",false)
	console.log(manageMode)

	const buttons = [{
		text:"编辑",
		click:()=>{updateGroupPopUp(type,group)}
	}]

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