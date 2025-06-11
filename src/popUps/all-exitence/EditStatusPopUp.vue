<template>
<EditStatus 
	:target
	:confirm
	:status
	:fullStatus
	:confirmText="confirmText"
	:banValueType="banValueType">
</EditStatus>
</template>

<script setup lang="ts" name=""> 
	import Status from '@/interfaces/Status';
	import EditStatus from '@/components/all-exitence/status/editStatus.vue';
	import { closePopUp, PopUp } from '@/hooks/pages/popUp';
	import { Exitence, ExitenceStatus } from '@/class/Exitence';
import { Type } from '@/class/Type';
	type Props = {
		target:Exitence|Type
		status?:Status|ExitenceStatus,
		fullStatus:Status,
		banValueType?:string[],
		confirmText?:string
	}

	// 编辑对象与编辑对象的属性等数据
	const {props,popUp,returnValue} = defineProps<{props:Props,popUp:PopUp,returnValue:(newStatus:Status|ExitenceStatus)=>void}>()
	let {
		target,
		status,
		fullStatus,
		banValueType,
		confirmText="确认"
	} = props

	// 确认编辑属性
	function confirm(newStatus:Status|ExitenceStatus){
		returnValue(newStatus)
		closePopUp(popUp)
	}
	
	
</script>

<style lang="scss" scoped>
@use "@/static/style/components/inputs.scss";
	
	
</style>