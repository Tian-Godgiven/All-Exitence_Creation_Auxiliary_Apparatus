<template>
	<div class="type">
		<div class="titleBar" @click=" expending = !expending ">
			<div class="titleButtons">
				<div @click="clickCreateExitence">创建事物</div>
				<div @click="clickCreateGroup">创建分组</div>
			</div>
			<div class="titleName">
				<div class="text">{{name}}</div>
			</div>
			
		</div>
		<div class="inner" v-show="expending">
			<groupVue v-for="(group) in groups" :group="group"></groupVue>
			<div v-for="(exitence,index) in noGroupExitence">
				<exitenceVue :exitence="exitence"></exitenceVue>
				<div class="separator" v-if="index < noGroupExitence.length-1"></div>
			</div>
		</div> 
	</div>
</template>

<script setup lang="ts" name=""> 
import groupVue from "./group.vue"
import exitenceVue from "./exitence.vue"
import { computed, reactive, ref, provide } from "vue";
import { createExitence,createGroup } from "@/hooks/all-exitence/allExitence";
import { showExitenceOnMain } from "@/hooks/mainPage/showOnMain";
import { hidePage } from "@/hooks/pageChange";


	let expending = ref(true)
	
	let {type} = defineProps(["type"])
	provide("type",type)

	// 分类名称
	let name = ref(type.name)
	// 分类中的分组
	let groups = reactive(type.groups)

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
	
	
	//点击创建事物
	async function clickCreateExitence(event:any){
		event.stopPropagation();
		const exitence = await createExitence(type)
		hidePage("left")
		showExitenceOnMain(exitence)
	}
	//点击创建分组
	async function clickCreateGroup(event:any){
		event.stopPropagation();
		createGroup(type)
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