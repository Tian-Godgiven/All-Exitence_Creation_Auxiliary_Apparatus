<template>
	<view class="type">
		<view class="titleBar" @click=" expending = !expending ">
			<view class="titleName">{{name}}</view>
			<view class="titleButtons">
				<view>按键B</view>
			</view>
		</view>
		<view class="inner" v-show="expending">
			<groupVue v-for="(group,index) in groups" :group="group"></groupVue>
			
			<view v-for="(exitence,index) in noGroupExitence">
				<exitenceVue :exitence="exitence"></exitenceVue>
				<view class="separator" v-if="index < noGroupExitence.length-1"></view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts" name=""> 
import groupVue from "./group.vue"
import exitenceVue from "./exitence.vue"
import { ref } from "vue";
	let expending = ref(true)
	
	let {type} = defineProps(["type"])
	let name = ref(type.name)
	// 分类中的分组
	let groups = ref(type.groups)
	// 没有分组的事物
	let noGroupExitence = ref(type.exitence)
</script>

<style lang="scss" scoped>
@import "@/static/style/leftPage.scss";
	.titleBar{
		@extend .leftPageMidTitleBar;
	}
	.separator{
		@extend .leftPageSeparator;
	}
</style>