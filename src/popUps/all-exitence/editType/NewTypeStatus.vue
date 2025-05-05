<template>
<div class="newStatus">
	<editStatus
		@confirm="createTypeStatus" 
		confirmText="新增"
		:banValueType="banValueType">
	</editStatus>
</div>
</template>

<script setup lang="ts" name=""> 
	import { provide, reactive, toRaw } from 'vue'; 
	import Status from '@/interfaces/Status';
	import editStatus from '@/components/all-exitence/status/editStatus.vue';
	import { cloneDeep } from 'lodash';
import { defaultStatus } from '@/hooks/all-exitence/status';
	// 不需要的类型
	const {banValueType,createStatus} = defineProps<{
		banValueType?:string[],
		createStatus:(status:Status)=>void
	}>()

	// 新增属性
	let newStatus = reactive<Status>(cloneDeep(defaultStatus))

	// 确认新增属性
	function createTypeStatus(newStatus:Status){
		// 将当前分类属性的数据传递回创建分类组件，形成新的属性
		const newTypeStatus = cloneDeep(toRaw(newStatus))
		createStatus(newTypeStatus)
	}

	provide("status",newStatus)
	provide("typeStatus",newStatus)
	
	
</script>

<style lang="scss" scoped>
	
	
</style>