<template>
<EditStatus 
	:confirm="confirm" 
	:status="status"
	:typeStatus="typeStatus"
	:confirmText="confirmText"
	:banValueType="banValueType">
</EditStatus>
</template>

<script setup lang="ts" name=""> 
	import { provide } from 'vue'; 
	import Status from '@/interfaces/Status';
	import EditStatus from '@/components/all-exitence/status/editStatus.vue';
	import { closePopUp, PopUp } from '@/hooks/pages/popUp';
import { ExitenceStatus } from '@/class/Exitence';
	type Props = {
		status?:Status|ExitenceStatus,
		typeStatus:Status,
		allStatus:Status[],
		allTypeStatus:Status[],
		banValueType?:string[],
		confirmText?:string
	}

	// 编辑对象与编辑对象的属性等数据
	const {props,popUp,returnValue} = defineProps<{props:Props,popUp:PopUp,returnValue:(newStatus:Status|ExitenceStatus)=>void}>()
	let {
		status,
		typeStatus,
		allStatus,
		allTypeStatus,
		banValueType,
		confirmText="确认"
	} = props

	provide("status",status)
	provide("typeStatus",typeStatus)
	provide("allStatus",allStatus)
	provide("allTypeStatus",allTypeStatus)

	// 确认编辑属性
	function confirm(newStatus:Status|ExitenceStatus){
		returnValue(newStatus)
		closePopUp(popUp)
	}
	
	
</script>

<style lang="scss" scoped>
@use "@/static/style/components/inputs.scss";
	
	
</style>