<template>
	<div class="selectValue">
		<ElSelect
		    v-model="status.value"
		    :multiple="ifMultiple"
			:clearable="true"
		    placeholder="请选择"
			:multiple-limit.number="chooseNum">
		    <ElOption
		        v-for="item in choiceList"
		        :key="item"
		        :value="item"/>
		</ElSelect>
	</div>
</template>

<script setup lang="ts" name=""> 
import { ExitenceStatus } from '@/class/Exitence';
import { getStatusSettingValue } from '@/hooks/all-exitence/status';
import Status from '@/interfaces/Status';
import { ElSelect,ElOption } from 'element-plus';
import { toNumber } from 'lodash';
import { computed, ref } from 'vue';
	const {status,fullStatus} = defineProps<{
        status:Status|ExitenceStatus,
        fullStatus:Status
    }>()
	if(!Array.isArray(status.value)){
		status.value = []
	}
	// 是否为多选模式
	const ifMultiple = ref(false)
	// 选项数组
	const choiceList = computed(()=>{
		const listValue = getStatusSettingValue<any>(fullStatus.setting,"choices","arr")??[]
		return listValue
	})
	// 选择数量，仅支持最大选择数量
	const chooseNum = computed(()=>{
		const maxNum = getStatusSettingValue<number>(fullStatus.setting,"choices","arr")??[0,1]
		const tmp = maxNum[1]
		if(tmp > 1){
			ifMultiple.value = true
		}
		else{
			ifMultiple.value = false
		}
		return toNumber(tmp)
	})

</script>

<style lang="scss" scoped>
	.selectValue{
		min-width: 200px;
	}
</style>