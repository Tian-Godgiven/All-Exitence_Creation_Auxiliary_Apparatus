<template>
	<view class="group">
		<view class="titleBar">
			<view class="titleName">分组名</view>
		</view>
		<view class="inner">
			<view v-for="(exitence,index) in group">
				<exitenceVue :exitence="exitence"></exitenceVue>
				<view class="separator" v-if="index < group.length-1"></view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts" name=""> 
import exitenceVue from './exitence.vue';

let group = ["1","2","3"]
</script>

<style lang="scss" scoped>
@import "@/static/style/leftPage.scss";
	.group{
		@include leftPageGroup;
	}
	.separator{
		@include leftPageSeparator;
	}
</style>