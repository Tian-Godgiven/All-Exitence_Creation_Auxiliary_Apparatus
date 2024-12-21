<template>
	<div class="newStatus">
		<editStatusVue @confirm="createTypeStatus" :banValueType="banValueType">
			<template v-slot:confirm>新增</template>
		</editStatusVue>
	</div>
</template>

<script setup lang="ts" name=""> 
	import { provide, reactive, toRaw } from 'vue'; 
	import Status from '@/interfaces/exitenceStatus';
	import editStatusVue from '../status/editStatus.vue';
	// 新增属性
	let newStatus = reactive<Status>({
		name:"",
		value:null,
		valueType:"downLine",
		setting:{},
		__key:null
	})

	// 不需要的类型
	const {banValueType} = defineProps(["banValueType"])

	// 确认新增属性
	let emit = defineEmits(["createStatus"])
	function createTypeStatus(newStatus:Status){
		// 将当前分类属性的数据传递回创建分类组件，形成新的属性
		const newTypeStatus = JSON.parse(JSON.stringify(toRaw(newStatus)))
		emit("createStatus",newTypeStatus)
	}

	provide("status",newStatus)
	provide("typeStatus",newStatus)
	
	
</script>

<style lang="scss" scoped>
@use "@/static/style/components/inputs.scss";
	
	
</style>