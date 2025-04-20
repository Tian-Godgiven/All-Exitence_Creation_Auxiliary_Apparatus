<template>
<ContainerLine 
	:buttonList :click :longTap :expending :getData :canDrop
	class="type">
	<template #title>
		<div class="title">{{type.name}}</div>
	</template>
	<template #inner>
		<groupVue v-for="group in type.groups" 
			:type
			:key="group.__key" 
			:group 
			:groupExitence="getExitenceInGroup(type.exitence,group)">
		</groupVue>
		<div v-for="exitence,index in showExitence">
			<exitenceVue :key="exitence.__key" :type :exitence></exitenceVue>
			<Separator v-if="index < showExitence.length-1"></Separator>
		</div>
	</template>
	<template #dragShadow>
		<div class="shadow">{{ type.name }}</div>
	</template>
</ContainerLine>
</template>

<script setup lang="ts" name=""> 
import groupVue from "./group.vue"
import exitenceVue from "./exitence.vue"
import { computed } from "vue";
import { createExitencePopUp, createGroupPopUp, deleteTypePopUp, getExitenceInGroup, getNoGroupExitence, updateTypePopUp } from "@/hooks/all-exitence/allExitence";
import { showTargetOnMain } from "@/hooks/pages/mainPage/showOnMain";
import { hidePage } from "@/hooks/pages/pageChange";
import { showControlPanel } from "@/hooks/controlPanel";
import { Type } from "@/class/Type";
import ContainerLine from "../ContainerLine.vue";
import { nowLeftManage } from "@/hooks/pages/leftPage";
import { ElementDragPayload } from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";
import Separator from "../Separator.vue";

	let {type} = defineProps<{type:Type}>()
	//切换展开
	const expending = computed(()=>{
		return type.expending
	})
	const click = ()=>{
		type.expending = !expending.value
	}
	//长按显示控制面板
	function longTap(){
		showControlPanel([{
			text:"编辑分类",
			click:()=>{
				updateTypePopUp(type)}
		},{
			text:"删除分类",
			click:()=>{deleteTypePopUp(type)}
		}])
	}

	// 没有分组的事物
	let noGroupExitence = computed(()=>{
		const tmp = getNoGroupExitence(type.exitence,type.groups)
		return tmp
	})
	//显示在页面上的事物
	const showExitence = computed(()=>{
		// 管理模式：不显示分组内的事物，并且显示所有事物
		if(nowLeftManage.value){
			return type.exitence
		}
		else{
			return noGroupExitence.value
		}
	})

	//点击创建事物并显示
	const clickCreateExitence = async()=>{
		const exitence = await createExitencePopUp(type)
		hidePage("left")
		showTargetOnMain({
			type:"exitence",
			target:exitence
		})
	}
	//点击创建分组
	const clickCreateGroup = async()=>{
		createGroupPopUp(type)
	}
	//按键列表
	const buttonList = {
		unmanage:[
			{name:"创建事物",click:clickCreateExitence,icon:undefined},
			{name:"创建分组",click:clickCreateGroup,icon:undefined}
		],
		manage:[
			{name:"删除",click:()=>deleteTypePopUp(type)}
		]
	}
	
	//获取数据
	function getData(){
		return {
			type:"type",
			__key:type.__key
		}
	}
	const canDrop = (source:ElementDragPayload)=>{
		return source.data.type == "type"
	}
</script>

<style lang="scss" scoped>
.type{
	position: relative;
	:deep(>.top){
		background-color: $bgColor80;
		height: 70px;
	}
	.title{
		line-height: 70px;
		width: 100%;
		height: 65px;
		font-size: $midFontSize;
		@include textMaxLine(1);
	}
}
</style>