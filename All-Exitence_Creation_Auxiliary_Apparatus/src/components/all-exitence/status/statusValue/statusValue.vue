<template>
	<div class="value" :class="disabled?'disabled':''">
		<component :status="status" :typeStatus="typeStatus" :statusSetting="statusSetting" :is="statusValueVueList[valueType]"></component>
	</div>
</template>

<script setup lang="ts" name="">
import {computed, provide, watch } from 'vue'; 
import { statusValueVueList } from '@/data/list/statusValueList';
import { changeExitenceName, nowAllExitence } from '@/hooks/all-exitence/allExitence';
import { translateToTextContent } from '@/hooks/expression/textAreaContent';

	//是否禁用属性修改 , 需要显示的属性对象，事物在分类中对应的属性
	const {disabled,status,typeStatus} = defineProps(["disabled","status","typeStatus"])
	//禁用功能需要透传
	if(disabled){
		provide("disabled",true)
	}

	console.log(status)
	
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

	//监听属性值的改变
	watch(()=>status.value,(value:any)=>{
		//事物设置：指定属性值与事物名称同步
		const syncWithName = statusSetting.value?.syncWithName
		console.log(status)
		if(syncWithName){
			const [typeKey,exitenceKey] = syncWithName
			const type = nowAllExitence.types.find((type)=>type.__key == typeKey)
			const exitence = type?.exitence.find((exitence)=>exitence.__key == exitenceKey)
			if(exitence){
				const newName = translateToTextContent(value)
				changeExitenceName(exitence,newName,true)
			}
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