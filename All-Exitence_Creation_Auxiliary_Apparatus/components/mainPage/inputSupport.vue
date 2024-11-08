<template>
	<view class="inputSupport">
		<view class="autoComplete">联想输入</view>
		<view class="buttons">
			按键列表
		</view>
	</view>
</template>

<script setup lang="ts" name=""> 

</script>

<style lang="scss" scoped>
	@import "@/static/style/global.scss";
	.inputSupport{
		display: flex;
		width: 100%;
		height: 50rpx;
		background-color: $buttonColor;
		position: absolute;
		bottom: 0;
		left: 0;
	}
</style>