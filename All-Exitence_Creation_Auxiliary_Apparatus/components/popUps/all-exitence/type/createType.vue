<template>
	<view>
		<view class="top">
			<input class="typeName downLine" placeholder="输入分类名称"/>
			<view class="button" @click="extendStatus">继承属性</view>
		</view>
		<!-- 分类属性 -->
		<view class="inner">
			<!-- 显示已有的属性 -->
			<typeStatusVue @deleteStatus="deleteStatus(index)" v-for="(status,index) in typeStatus" v-model="typeStatus[index]"></typeStatusVue>
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
import { provide, ref } from 'vue'; 
import typeStatusVue from './typeStatus.vue';
import newTypeStatusVue from './newTypeStatus.vue';
	let typeStatus = ref([])
	provide("typeStatus",typeStatus)
	
	//添加指定的属性，给予key标识符
	function addStatus(newStatus:{}){
		let key:number
		if(typeStatus.value.length == 0){
			key = 0
		}
		else{
			key = typeStatus.value[typeStatus.value.length-1].__key + 1
		}
		//给予key标识符
		newStatus["__key"] = key
		typeStatus.value.push(newStatus)
	}
	
	function extendStatus(){
		
	}
	
	//删除对应的属性
	function deleteStatus(index:number){
		typeStatus.value.splice(index,1)
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