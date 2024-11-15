<template>
	<view v-for="(status,index) in typeStatus" :status="status" class="status">
		<view class="name">{{status.name}}：</view>
		<view class="valueType">{{status.valueType}}</view>
		<view class="buttons">
			<view>编辑</view>
			<view>删除</view>
		</view>
		<view class="statusSetting"></view>
	</view>
</template>

<script setup lang="ts" name="typeStatus"> 
	let typeStatus = defineModel()
</script>

<style lang="scss" scoped>
	.status{
		display: flex;
	}
</style>