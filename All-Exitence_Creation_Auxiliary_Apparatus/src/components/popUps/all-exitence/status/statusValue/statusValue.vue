<template>
	<div class="value">
		<component :statusSetting="statusSetting" :disabled="disabled" :is="statusValueVueList[valueType]"></component>
	</div>
</template>

<script setup lang="ts" name="">
import {computed, inject } from 'vue'; 
import { statusValueVueList } from '@/data/list/statusValueList';

	const status = inject<any>("status")
	const typeStatus = inject<any>("typeStatus",null)

	const {disabled} = defineProps(["disabled"])
	
	//如果status中的值为空
	if(!status.value || status.value == undefined){
		if(typeStatus){
			status["value"] = typeStatus.value
		}
		else{
			status.value = null
		}
		
	}
	//优先使用status中的值
	let valueType = computed(()=>{
		return status["valueType"] || typeStatus["valueType"]
	})
	//传递属性的setting
	const statusSetting = computed(()=>{
		if(typeStatus){
			return Object.assign(typeStatus.setting,status?.setting)
		}
		else{
			return status.setting || {}
		}
		
	})
</script>

<style lang="scss" scoped>
	.value{
		width: 100%;
	}
</style>