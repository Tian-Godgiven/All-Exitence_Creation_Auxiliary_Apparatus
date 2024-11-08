<template>
	<view class="all-exitence">
		<view class="titleBar">
			<view class="titleName">万物</view>
			<view class="titleButtons">
				<view>按键A</view>
			</view>
		</view>
		<view class="inner">
			<typeVue></typeVue>
		</view>
	</view>
</template>

<script setup lang="ts" name=""> 
import typeVue from './type.vue';

</script>

<style lang="scss" scoped>
	@import "@/static/style/global.scss";
	@import "@/static/style/leftPage.scss";
	
	.all-exitence{
		width: 100%;
	}
	.titleBar{
		@include leftPageBigTitleBar;
	}
</style>