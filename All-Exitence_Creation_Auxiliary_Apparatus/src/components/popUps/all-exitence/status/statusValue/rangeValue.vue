<template>
	<div class="rangeValue">
		<ElSlider v-model="status.value" 
			:max="max" :min="min" :step="step"
			placement="bottom">
		</ElSlider>
	</div>
</template>

<script setup lang="ts" name="">
import { inject, ref, watch } from 'vue'; 
import { ElSlider } from 'element-plus';

	const status = inject<any>("status")
	let min = ref(0)
	let max = ref(100)
	let step = ref(1)
	watch(()=> status["setting"]["range"],()=>{
		let tmp = status["setting"]["range"]
		min.value = tmp[0] ? tmp[0]:0
		max.value = tmp[1] ? tmp[1]:100
		step.value = tmp[2] ? tmp[2]:1
	},{immediate:true})
	
</script>

<style lang="scss" scoped>
	.rangeValue{
		min-width: 200px;
	}
</style>