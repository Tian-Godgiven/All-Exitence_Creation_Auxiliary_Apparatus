<template>
	<view class="all-exitence">
		<view class="titleBar" @click="expending = !expending">
			<view class="titleName">万物</view>
			<view class="titleButtons">
				<view>按键A</view>
			</view>
		</view>
		<view class="inner" v-show="expending">
			<typeVue v-for="(type,index) in types" :type="type"></typeVue>
		</view>
	</view>
</template>

<script setup lang="ts" name=""> 
import { ref } from 'vue';
import typeVue from './type.vue';
let expending = ref(true)

import AllExitence from "@/data/projects/项目1/all-exitence.json"

	let allExitence = AllExitence;
	let types = allExitence.types


</script>

<style lang="scss" scoped>
	@import "@/static/style/global.scss";
	@import "@/static/style/leftPage.scss";
	
	.all-exitence{
		width: 100%;
	}
	.titleBar{
		@extend .leftPageBigTitleBar;
	}
</style>