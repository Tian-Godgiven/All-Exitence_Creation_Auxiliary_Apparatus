<template>
<div class="value" :class="disabled?'disabled':''">
	<component :status :fullStatus :is="statusValueVueList[valueType]"></component>
</div>
</template>

<script setup lang="ts" name="">
import {computed, provide, watch } from 'vue'; 
import { statusValueVueList } from '@/static/list/statusValueList';
import { changeExitenceName, changeExitenceNickName, nowAllExitence } from '@/hooks/all-exitence/allExitence';
import { translateToTextContent } from '@/hooks/expression/textAreaContent';
import Status from '@/interfaces/Status';
import { ExitenceStatus } from '@/class/Exitence';
import { getStatusSettingValue } from '@/hooks/all-exitence/status';
	const {disabled=false,status,fullStatus} = defineProps<{
		disabled?:boolean;//是否禁用属性修改
		status:Status|ExitenceStatus,//实际操作和修改的属性对象
		fullStatus:Status,//用于读取的只读的完整属性
	}>()
	//禁用功能需要透传
	if(disabled){provide("disabled",true)}
	
	//优先使用status中的valueType
	let valueType = computed(()=>{
		return fullStatus.valueType
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
	}
	.value.disabled{
		pointer-events: none;
	}
</style>