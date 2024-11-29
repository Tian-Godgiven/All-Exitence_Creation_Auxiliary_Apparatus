<template>
	<view class="value">
		<component :value="status['value']" :is="statusValueVueList[valueType]"></component>
	</view>
</template>

<script setup lang="ts" name="">
import {computed, inject, provide} from 'vue'; 
import { statusValueVueList } from '@/data/list/statusValueList';
	let status = inject("status")
	let valueType = computed(()=>{
		return status["valueType"]
	})
	// 修改属性值
	const changeStatusValue = (value)=>{
		console.log(value)
		status['value'] = value
	}
	provide("changeStatusValue",changeStatusValue)
	
</script>

<style lang="scss" scoped>
	.value{
		width: 100%;
		
	}
</style>