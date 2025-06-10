<template>
<div class="rangeValue">
	<ElSlider v-model="status.value" 
		@pointerdown.stop
		:max="max" :min="min" :step="step"
		placement="bottom"
		:format-tooltip="tipInfo">
	</ElSlider>
</div>
</template>

<script setup lang="ts" name="">
import { ref, watch,computed } from 'vue'; 
import { ElSlider } from 'element-plus';
import Status from '@/interfaces/Status';
import { ExitenceStatus } from '@/class/Exitence';
import { getStatusSettingValue } from '@/hooks/all-exitence/status';
	const {status,fullStatus} = defineProps<{
		status:Status|ExitenceStatus,
		fullStatus:Status
	}>()
	const range = getStatusSettingValue<number>(fullStatus.setting,"range","arr")??[0,100,1]
	let min = ref(range[0])
	let max = ref(range[1])
	let step = ref(range[2])
	watch(()=> range,()=>{
		let tmp = range
		min.value = tmp[0] ?? 0
		max.value = tmp[1] ?? 100
		step.value = tmp[2] ?? 1
	},{immediate:true})
	// 属性设置：单位 
	const unit = ref('')
	const ifUnit = computed(()=>{
		const unitValue = getStatusSettingValue(fullStatus.setting,"unit","string")
		if(unitValue){
			unit.value = unitValue
			return true
		}
		return false
	})
	function tipInfo(){
		if(ifUnit.value){
			return status.value + unit.value
		}
		return status.value
	}
	
</script>

<style lang="scss" scoped>
.rangeValue{
	min-width: 200px;
	:deep(.el-slider__button){
		// 拖动的滑块的样式
		width: 16px;
		height: 22px;
		border: 10px solid var(--el-color-primary);
		border-radius: 1px;
		position: relative;
		left: 4px;
	}
}
	

</style>