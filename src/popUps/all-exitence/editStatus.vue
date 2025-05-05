<template>
<editStatusVue 
	@confirm="confirm" 
	:confirmText="confirmText"
	:banValueType="banValueType">
</editStatusVue>
</template>

<script setup lang="ts" name=""> 
	import { provide, toRaw,reactive } from 'vue'; 
	import Status from '@/interfaces/Status';
	import editStatusVue from '@/components/all-exitence/status/editStatus.vue';
	import { closePopUp } from '@/hooks/pages/popUp';
    import { cloneDeep } from 'lodash';
	import { nanoid } from 'nanoid';
import { defaultStatus } from '@/hooks/all-exitence/status';

	// 编辑对象与编辑对象的属性等数据
	const {props={},popUp,returnValue} = defineProps(["props","popUp","returnValue"])
	let {
		status,
		typeStatus,
		allStatus,
		allTypeStatus,
		banValueType,
		confirmText="确认"
	} = props

    //status存在则创建深拷贝，否则创建新status
	const tmpStatus = status? reactive(cloneDeep(status)) : 
							reactive<Status>(cloneDeep(defaultStatus))
    //如果typeStatus不存在，则其为tmpStatus
    if(!typeStatus){
        typeStatus = tmpStatus
    }

	provide("status",tmpStatus)
	provide("typeStatus",typeStatus)
	provide("allStatus",allStatus)
	provide("allTypeStatus",allTypeStatus)

	// 确认编辑属性
	function confirm(newStatus:Status){
		// 返回这些属性,并给新属性添加__key
		if(!tmpStatus.__key){tmpStatus.__key = nanoid()}
		const newTypeStatus = JSON.parse(JSON.stringify(toRaw(newStatus)))
		returnValue(newTypeStatus)
		closePopUp(popUp)
	}
	
	
</script>

<style lang="scss" scoped>
@use "@/static/style/components/inputs.scss";
	
	
</style>