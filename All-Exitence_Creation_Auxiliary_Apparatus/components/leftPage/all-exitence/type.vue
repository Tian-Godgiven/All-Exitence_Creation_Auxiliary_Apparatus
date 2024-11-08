<template>
	<view class="type">
		<view class="titleBar">
			<view class="titleName">分类名</view>
			<view class="titleButtons">
				<view>按键B</view>
			</view>
		</view>
		<view class="inner">
			<view v-for="(group,index) in groups" >
				<groupVue :group="group"></groupVue>
			</view> 
			
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
// 分类中的分组
let groups = [9]
// 没有分组的事物
let noGroupExitence = [1,2,3]
</script>

<style lang="scss" scoped>
@import "@/static/style/leftPage.scss";
	.titleBar{
		@include leftPageMidTitleBar;
	}
	.separator{
		@include leftPageSeparator;
	}
</style>