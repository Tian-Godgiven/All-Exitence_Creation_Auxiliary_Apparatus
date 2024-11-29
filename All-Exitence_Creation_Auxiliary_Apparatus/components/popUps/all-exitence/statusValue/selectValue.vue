<template>
	<view>
		<ElSelect
		    v-model="chosenList"
		    :multiple="ifMultiple"
			:clearable="true"
		    placeholder="请选择"
			:multiple-limit="chooseNum"
			@change="takeChoose()">
		    <ElOption
		        v-for="item in choiceList"
		        :key="item"
		        :value="item"/>
		</ElSelect>
	</view>
</template>

<script setup lang="ts" name=""> 
import { ElSelect,ElOption } from 'element-plus';
import { computed, inject, ref, toRaw } from 'vue';
	const status = inject("status")
	const changeStatusValue = inject("changeStatusValue")
	// 是否为多选模式
	const ifMultiple = ref(false)
	// 选项数组
	const choiceList = computed(()=>{
		return status["setting"]['choices']
	})
	// 选择数量，仅支持最大选择数量
	const chooseNum = computed(()=>{
		const tmp = status["setting"]['chooseNum'][1]
		if(tmp > 1){
			ifMultiple.value = true
		}
		else{
			ifMultiple.value = false
		}
		return tmp
	})
	// 已选择选项数组
	const chosenList = ref()
	// 多选
	if(ifMultiple.value){
		chosenList.value = status['value']?status['value']:[]
	}
	// 单选
	else{
		chosenList.value = status['value']?status['value'][0]:null
	}
	
	// 选择一个选项
	const takeChoose = ()=>{
		// 如果是多选模式
		if(ifMultiple.value){
			changeStatusValue(toRaw(chosenList.value))
		}
		// 否则返回数组
		else{
			changeStatusValue([chosenList.value])
		}
		
	}
</script>

<style lang="scss" scoped>

</style>