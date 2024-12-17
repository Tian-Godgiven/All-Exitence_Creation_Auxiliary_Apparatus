<template>
	<div class="inputBox" :class="ifHoverBox? 'hoverBox':''"> 
		<textAreaVue 
			:disabled="disabled"
			class="textArea"
			v-model="status.value"
			placeholder="输入默认值"/>
		<div class="unit" v-if="ifUnit">{{ unit }}</div>
	</div>
</template>

<script setup lang="ts" name="">
import { computed, inject, ref } from 'vue'; 
import textAreaVue from '@/components/other/textArea/textArea.vue';
	const status = inject<any>("status")
	const {disabled,statusSetting} = defineProps(["disabled","statusSetting"])
	// 属性设置：聚焦不显示显示高亮输入框
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
</script>

<style lang="scss" scoped>
	.inputBox{
		display: flex;
		width: 100%;
		border:3px solid black;
		.textArea{
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