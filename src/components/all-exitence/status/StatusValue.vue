<template>
<div class="value" :class="disabled?'disabled':''">
	<component v-if="valueComponent" :status :fullStatus :target :is="valueComponent"></component>
	<div v-else class="unsupportedValue">{{ unsupportedValue }}</div>
</div>
</template>

<script setup lang="ts" name="">
import {computed, provide, watch } from 'vue'; 
import { statusValueVueList } from '@/static/list/statusValueList';
import { changeExitenceName, changeExitenceNickName, nowAllExitence } from '@/hooks/all-exitence/allExitence';
import { translateToTextContent } from '@/hooks/expression/textAreaContent';
import Status from '@/interfaces/Status';
import { Exitence, ExitenceStatus } from '@/class/Exitence';
import { getStatusSettingValue } from '@/hooks/all-exitence/status';
import { Type } from '@/class/Type';
	const {disabled=false,status,fullStatus,target} = defineProps<{
		disabled?:boolean;//是否禁用属性修改
		status:Status|ExitenceStatus,//实际操作和修改的属性对象
		fullStatus:Status,//用于读取的只读的完整属性
		target:Exitence|Type,//属性当前所处的对象
	}>()
	//禁用功能需要透传
	if(disabled){provide("disabled",true)}
	
	//优先使用status中的valueType
	let valueType = computed(()=>{
		return fullStatus.valueType
	})
	const valueComponent = computed(()=>statusValueVueList[valueType.value])
	const unsupportedValue = computed(()=>{
		const value = status.value
		if(value == null)return ''
		if(typeof value == 'string' || typeof value == 'number' || typeof value == 'boolean'){
			return String(value)
		}
		if(Array.isArray(value)){
			if(value.every(part=>typeof part == 'string' || (part && typeof part.text == 'string'))){
				return value.map(part=>typeof part == 'string' ? part : part.text).join('')
			}
		}
		try{return JSON.stringify(value,null,2)}
		catch{return String(value)}
	})

	//监听属性值的改变
	watch(()=>status.value,(value:any)=>{
		//事物设置：指定属性值与事物名称同步
		const syncWithName = getStatusSettingValue<string>(fullStatus,"exitenceSetting-syncWithName","arr")
		if(syncWithName){
			const [typeKey,exitenceKey] = syncWithName
			const type = nowAllExitence.types.find((type)=>type.__key == typeKey)
			const exitence = type?.exitence.find((exitence)=>exitence.__key == exitenceKey)
			if(exitence){
				const newName = translateToTextContent(value)
				changeExitenceName(exitence,newName,true)
			}
		}
		//事物设置：指定属性值为事物的别名
		const nickName = getStatusSettingValue<string>(fullStatus,"exitenceSetting-nickName","arr")
		if(nickName){
			const [typeKey,exitenceKey] = nickName
			const type = nowAllExitence.types.find((type)=>type.__key == typeKey)
			const exitence = type?.exitence.find((exitence)=>exitence.__key == exitenceKey)
			if(exitence){
				changeExitenceNickName(exitence,value)
			}
		}
	},{
		deep:true,
	})
</script>

<style lang="scss" scoped>
	.value{
		flex-grow: 1;
		width: 100%;
		min-width: 0;
	}
	.value.disabled{
		pointer-events: none;
	}
	.unsupportedValue{
		max-width: 100%;
		white-space: pre-wrap;
		overflow-wrap: anywhere;
	}
</style>
