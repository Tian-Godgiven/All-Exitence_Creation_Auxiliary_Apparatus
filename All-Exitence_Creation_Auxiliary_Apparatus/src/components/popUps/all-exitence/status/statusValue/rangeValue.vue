<template>
	<div class="rangeValue">
		<ElSlider v-model="status.value" 
			:max="max" :min="min" :step="step"
			placement="bottom"
			:format-tooltip="tipInfo">
		</ElSlider>
	</div>
</template>

<script setup lang="ts" name="">
import { ref, watch,computed } from 'vue'; 
import { ElSlider } from 'element-plus';

	const {status,statusSetting} = defineProps(["status","statusSetting"])
	let min = ref(0)
	let max = ref(100)
	let step = ref(1)
	watch(()=> statusSetting["range"],()=>{
		let tmp = statusSetting["range"]
		min.value = tmp[0] ?? 0
		max.value = tmp[1] ?? 100
		step.value = tmp[2] ?? 1
	},{immediate:true})
	// 属性设置：单位 
	const unit = ref('')
	const ifUnit = computed(()=>{
		if(statusSetting.unit && statusSetting.unit != ""){
			unit.value = statusSetting.unit
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