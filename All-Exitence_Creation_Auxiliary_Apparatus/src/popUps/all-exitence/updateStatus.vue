<template>
	<div class="updateStatus">
		<editStatusVue @confirm="updateStatus">
			<template v-slot:confirm>确认</template>
		</editStatusVue>
	</div>
</template>

<script setup lang="ts" name=""> 
	import { provide, toRaw } from 'vue'; 
	import Status from '@/interfaces/exitenceStatus';
	import editStatusVue from '@/components/popUps/all-exitence/status/editStatus.vue';
import { closePopUp } from '@/hooks/popUp';
	// 编辑对象与编辑对象的属性等数据
	const {props,popUp,returnValue} = defineProps(["props","popUp","returnValue"])
	const {status,typeStatus,allStatus,allTypeStatus} = props
	const emits = defineEmits(["confirm"])

	provide("status",status)
	provide("typeStatus",typeStatus)
	provide("allStatus",allStatus)
	provide("allTypeStatus",allTypeStatus)

	// 确认编辑属性
	function updateStatus(newStatus:Status){
		// 返回这些属性
		const newTypeStatus = JSON.parse(JSON.stringify(toRaw(newStatus)))
		returnValue(newTypeStatus)
		closePopUp(popUp)
	}
	
	
</script>

<style lang="scss" scoped>
@use "@/static/style/components/inputs.scss";
	
	
</style>