<template>
<div class="inputValue">
	<textAreaVue
		class="textArea"
		:class="ifUnit?'withUnit':''"
		v-model="status.value"
		:input-support="true"
		:input-suggestion-list="inputSuggestionList"
		:placeholder="placeholder"/>
	<div class="unit" v-if="ifUnit">{{ unit }}</div>
</div>
</template>

<script setup lang="ts" name="">
import { computed, ref } from 'vue'; 
import textAreaVue from '@/components/other/textArea/textArea.vue';
import { ExitenceStatus } from '@/class/Exitence';
import Status from '@/interfaces/Status';
import { getStatusSettingValue } from '@/hooks/all-exitence/status';
	const {status,fullStatus} = defineProps<{
        status:Status|ExitenceStatus,
        fullStatus:Status
    }>()
	// 属性设置：单位
	const unit = ref("")
	const ifUnit = computed(()=>{
		const unitValue = getStatusSettingValue(fullStatus.setting,"unit","string")
		if(unitValue){
			unit.value = unitValue
			return true
		}
		return false
	})
	//属性设置：占位符
	const placeholder = computed(()=>{
		return getStatusSettingValue(fullStatus.setting,"inputPlaceholder","string") 
			?? "输入属性值"
	})
	//属性设置：启用全局输入建议 和 启用项目输入建议
	const inputSuggestionList = computed(()=>{
		const ifG = getStatusSettingValue(fullStatus.setting,"ifGlobalInputSuggestion","bool")
		const ifP = getStatusSettingValue(fullStatus.setting,"ifProjectInputSuggestion","bool")
		//都不要
		if(ifG == false && ifP == false){return null}
		//仅项目
		if(ifP != false && ifG == false){return "project"}
		//仅全局
		if(ifP == false && ifG != false){return "global"}
		//全局+项目
		return "all"
	})


</script>

<style lang="scss" scoped>
.inputValue{
	width: 100%;
	display: flex;
	.textArea.withUnit{
		width: auto;
		max-width: calc(100% - 3rem);
	}
	.unit{
		max-width: 3rem;
		flex-shrink: 0;
		word-break: break-all;
		white-space: normal;
	}
}
</style>