<template>
	<div class="selectValue">
		<ElSelect
		    v-model="status.value"
		    :multiple="ifMultiple"
			:clearable="true"
		    placeholder="请选择"
			:multiple-limit="chooseNum">
		    <ElOption
		        v-for="item in choiceList"
		        :key="item"
		        :value="item"/>
		</ElSelect>
	</div>
</template>

<script setup lang="ts" name=""> 
import { ElSelect,ElOption } from 'element-plus';
import { computed, ref } from 'vue';
	const {status,statusSetting} = defineProps(["status","statusSetting"])
	if(!Array.isArray(status.value)){
		status.value = []
	}
	// 是否为多选模式
	const ifMultiple = ref(false)
	// 选项数组
	const choiceList = computed(()=>{
		return statusSetting['choices']
	})
	// 选择数量，仅支持最大选择数量
	const chooseNum = computed(()=>{
		const tmp = statusSetting['chooseNum'][1]
		if(tmp > 1){
			ifMultiple.value = true
		}
		else{
			ifMultiple.value = false
		}
		return tmp
	})

</script>

<style lang="scss" scoped>
	.selectValue{
		min-width: 200px;
	}
</style>