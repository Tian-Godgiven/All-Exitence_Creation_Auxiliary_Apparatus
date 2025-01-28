<template>
	<div class="inputBox" :class="ifHoverBox? 'hoverBox':''"> 
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
	const {status,statusSetting} = defineProps(["status","statusSetting"])

	// 属性设置：聚焦不显示高亮输入框
	const ifHoverBox = computed(()=>{
		if(statusSetting.hoverBox == false){
			return false
		}
		return true
	})
	// 属性设置：单位 
	const unit = ref('')
	const ifUnit = computed(()=>{
		if(statusSetting.unit != ""){
			unit.value = statusSetting.unit
			return true
		}
		return false
	})
	//属性设置：占位符
	const placeholder = computed(()=>{
		if(statusSetting.inputPlaceholder){
			return statusSetting.inputPlaceholder
		}
		//默认值
		return "输入属性值"
	})
	//属性设置：启用全局输入建议 和 启用项目输入建议
	const inputSuggestionList = computed(()=>{
		const ifG = statusSetting.ifGlobalInputSuggestion
		const ifP = statusSetting.ifProjectInputSuggestion
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
	.inputBox{
		display: flex;
		width: 100%;
		border:3px solid black;
		box-sizing: border-box;
		.textArea.withUnit{
			max-width: calc(100% - 3rem);
		}
		.unit{
			width: 3rem;
			flex-shrink: 0;
			white-space: normal;
		}
	}
	.hoverBox:focus-within{
		outline: 3px solid blue;
	};

	
</style>