<template>
	<view class="articles">
		<view class="titleBar">
			<view class="titleName">文本</view>
		</view>
		<view class="inner">
			<view class="chapter">
				<view class="article"></view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts" name=""> 

</script>

<style lang="scss" scoped>
	@import "@/static/style/leftPage.scss";
	
	.article{
		width: 100%;
	}
	.titleBar{
		@include leftPageBigTitleBar;
	}
</style>