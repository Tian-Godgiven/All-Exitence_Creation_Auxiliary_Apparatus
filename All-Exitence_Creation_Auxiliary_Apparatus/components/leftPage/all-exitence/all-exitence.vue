<template>
	<view class="all-exitence">
		<typeVue v-for="(type,index) in types" :type="type"></typeVue>
	</view>
</template>

<script setup lang="ts" name=""> 
import { ref } from 'vue';
import typeVue from './type.vue';

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