<template>
	<div class="value" :class="disabled?'disabled':''">
		<component :statusSetting="statusSetting" :is="statusValueVueList[valueType]"></component>
	</div>
</template>

<script setup lang="ts" name="">
import {computed, inject, provide } from 'vue'; 
import { statusValueVueList } from '@/data/list/statusValueList';
	//需要显示的属性对象
	const status = inject<any>("status")
	//事物所在的分类属性typeStatus对象，如果是分类则其就是分类的属性
	const typeStatus = inject<any>("typeStatus")

	//是否禁用属性修改
	const {disabled} = defineProps(["disabled"])
	if(disabled){
		provide("disabled",true)
	}
	
	//如果status中的值为空，则使用typeStatus中的默认值
	if(!status.value || status.value == undefined){
		if(typeStatus){
			status["value"] = typeStatus.value
		}
		else{
			status.value = null
		}
	}
	//优先使用status中的valueType
	let valueType = computed(()=>{
		return status["valueType"] || typeStatus["valueType"]
	})
	//优先使用两者覆盖后的setting
	const statusSetting = computed(()=>{
		//如果两者不同，则使用覆盖后的setting
		if(typeStatus && typeStatus != status){
			return {...typeStatus.setting,...status?.setting}
		}
		//否则使用status中的setting
		else{
			return status.setting || {}
		}
	})
</script>

<style lang="scss" scoped>
	.value{
		width: 100%;
	}
	.value.disabled{
		pointer-events: none;
	}
</style>