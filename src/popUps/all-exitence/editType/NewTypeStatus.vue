<template>
<div class="newStatus">
	<EditStatus
		:status="newStatus"
		:fullStatus="newStatus"
		confirmText="新增"
		:confirm="createTypeStatus" 
		:banValueType="banValueType">
	</EditStatus>
</div>
</template>

<script setup lang="ts" name=""> 
	import { reactive, toRaw } from 'vue'; 
	import Status from '@/interfaces/Status';
	import EditStatus from '@/components/all-exitence/status/editStatus.vue';
	import { cloneDeep } from 'lodash';
import { createNewEmptyStatus } from '@/hooks/all-exitence/status';
import { ExitenceStatus } from '@/class/Exitence';
	// 不需要的类型
	const {banValueType,createStatus} = defineProps<{
		banValueType?:string[],
		createStatus:(status:Status)=>void
	}>()

	// 新增属性
	let newStatus = reactive<Status>(createNewEmptyStatus())

	// 确认新增属性
	function createTypeStatus(newStatus:Status|ExitenceStatus){
		// 将当前分类属性的数据传递回创建分类组件，形成新的属性
		const newTypeStatus = cloneDeep(toRaw(newStatus)) as Status
		createStatus(newTypeStatus)
	}
	
</script>

<style lang="scss" scoped>
	
	
</style>