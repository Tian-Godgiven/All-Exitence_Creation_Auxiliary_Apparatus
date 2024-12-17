<template>
	<div class="downLineValue">
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
	// 属性设置：单位
	const unit = ref('')
	const ifUnit = computed(()=>{
		if(statusSetting.unit && statusSetting.unit != ""){
			unit.value = statusSetting.unit
			return true
		}
		return false
	})
</script>

<style lang="scss" scoped>
	.downLineValue{
		width: 100%;
		display: flex;
		.textArea{
			max-width: calc(100% - 3rem);
			text-decoration: underline;
			text-decoration-color: inherit;
		}
		.unit{
			width: 3rem;
			flex-shrink: 0;
			white-space: normal;
		}
	}
</style>