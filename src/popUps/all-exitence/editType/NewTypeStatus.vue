<template>
<div class="newStatus">
	<EditStatus
		inline
		:target="type"
		:status="newStatus"
		:fullStatus="newStatus"
		confirmText="确认"
		:confirm="createTypeStatus" 
		:banValueType="banValueType">
		<template #header>新增属性</template>
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
import { Type } from '@/class/Type';
	// 不需要的类型
	const {banValueType,createStatus,type} = defineProps<{
		banValueType?:string[],
		createStatus:(status:Status)=>void
		type:Type
	}>()

	// 新增属性
	let newStatus = reactive<Status>(createNewEmptyStatus())

	// 确认新增属性
	function createTypeStatus(newStatus:Status|ExitenceStatus){
		// 将当前分类属性的数据传递回创建分类组件，形成新的属性
		const newTypeStatus = cloneDeep(toRaw(newStatus)) as Status
		createStatus(newTypeStatus)
		Object.assign(newStatus,createNewEmptyStatus())
	}
	
</script>

<style lang="scss" scoped>
	.newStatus{
		margin-top: 18px;
		padding-top: 18px;
		border-top: 1px solid $bgColor70;
		:deep(.editStatus){
			border: 1px solid $bgColor70;
			border-radius: 6px;
		}
	}
</style>
