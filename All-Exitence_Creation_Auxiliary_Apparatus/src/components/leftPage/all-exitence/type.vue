<template>
	<div class="type">
		<div class="titleBar" @click=" expending = !expending ">
			<div class="titleName">{{name}}</div>
			<div class="titleButtons">
				<div @click="clickCreateExitence">创建事物</div>
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
import { ref } from "vue";
import { createExitence } from "@/hooks/all-exitence/allExitence";
import { showExitenceOnMain } from "@/hooks/mainPage/showOnMain";
import { hidePage } from "@/hooks/pageChange";
	let expending = ref(true)
	
	let {type} = defineProps(["type"])
	let name = ref(type.name)
	// 分类中的分组
	let groups = ref(type.groups)
	// 没有分组的事物
	let noGroupExitence = ref(type.exitence)

	async function clickCreateExitence(event:any){
		event.stopPropagation();
		const exitence = await createExitence(type)
		hidePage("left")
		showExitenceOnMain(exitence)
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