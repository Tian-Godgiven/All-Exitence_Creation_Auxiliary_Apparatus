<template>
	<view>
		<view class="top">
			<input class="typeName downLine" placeholder="输入分类名称"/>
			<view class="button" @click="extendStatus">继承属性</view>
		</view>
		<!-- 分类属性 -->
		<view class="inner">
			<!-- 显示已有的属性 -->
			<typeStatusVue v-model="typeStatus"></typeStatusVue>
			<!-- 创建新属性 -->
			<newTypeStatusVue @createStatus="addStatus($event)"></newTypeStatusVue>
		</view>
		<!-- 分类设置 -->
		<view class="setting">
			分类设置
		</view>
	</view>
</template>

<script setup lang="ts" name="">
import { computed, reactive, ref, toRaw } from 'vue'; 
import typeStatusVue from './typeStatus.vue';
import newTypeStatusVue from './newTypeStatus.vue';
	let typeStatus = ref([])
	
	function addStatus(newStatus:{}){
		typeStatus.value.push(newStatus)
	}
	
	function extendStatus(){
		
	}
</script>

<style lang="scss" scoped>
@import "@/static/style/components/inputs.scss";
	.top{
		display: flex;
		.typeName{
			@extend .downLine;
			width: 550rpx;
			height: 80rpx;
		}
		.button{
			height: 80rpx;
			width: 80rpx;
			border: 3rpx solid black;
			margin: 10rpx
		}
	}
	.inner{
		width: 100%;
		
	}
</style>