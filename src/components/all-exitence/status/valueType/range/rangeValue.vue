<template>
<div class="rangeValue">
	<ElSlider v-model="value"
		@pointerdown.stop
		:max="max" :min="min" :step="step"
		placement="bottom"
		:format-tooltip="tipInfo">
	</ElSlider>
</div>
</template>

<script setup lang="ts" name="">
import { computed, ref } from 'vue';
import { ElSlider } from 'element-plus';
import Status from '@/interfaces/Status';
import { ExitenceStatus } from '@/class/Exitence';
import { getStatusSettingValue } from '@/hooks/all-exitence/status';
	const {status,fullStatus,min:propMin,max:propMax,step:propStep} = defineProps<{
		status?:Status|ExitenceStatus,
		fullStatus?:Status,
		min?:number,
		max?:number,
		step?:number,
	}>()
	const modelValue = defineModel<number>()
	const range = computed(()=> status && fullStatus ? getStatusSettingValue<number>(fullStatus.setting,"range","arr")??[0,100,1] : [propMin ?? 0,propMax ?? 100,propStep ?? 1])
	const min = computed(()=>range.value[0] ?? 0)
	const max = computed(()=>range.value[1] ?? 100)
	const step = computed(()=>range.value[2] ?? 1)
	const value = computed<number>({
		get:()=>status ? Number(status.value) : modelValue.value ?? min.value,
		set:(newValue)=>{ if(status)status.value = newValue; else modelValue.value = newValue }
	})
	// 属性设置：单位 
	const unit = ref('')
	const ifUnit = computed(()=>{
		const unitValue = fullStatus ? getStatusSettingValue(fullStatus.setting,"unit","string") : null
		if(unitValue){
			unit.value = unitValue
			return true
		}
		return false
	})
	function tipInfo(){
		if(ifUnit.value){
		return value.value + unit.value
		}
		return value.value
	}
	
</script>

<style lang="scss" scoped>
.rangeValue{
	width: 100%;
	max-width: 600px;
	min-width: 0;
	--el-color-primary: #{$bgColor40};
	--el-slider-runway-bg-color: #{$bgColor85};
	:deep(.el-slider__button){
		width: 16px;
		height: 16px;
		border: 2px solid $bgColor40;
		border-radius: 50%;
		background: $bgColor;
		box-sizing: border-box;
		box-shadow: none;
	}
	:deep(.el-slider__button.hover),
	:deep(.el-slider__button:hover){ border-color: $antiBgColor; }
}
	

</style>
