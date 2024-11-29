<template>
	<view>
		<ElSlider v-model="newValue" 
			@change="changeStatusValue(newValue)"
			:max="max" :min="min" :step="step"
			placement="bottom"
			></ElSlider>
	</view>
</template>

<script setup lang="ts" name="">
import { computed, inject, ref, watch } from 'vue'; 
import { ElSlider } from 'element-plus';

	const {value} = defineProps(["value"])
	const status = inject("status")
	const changeStatusValue = inject("changeStatusValue")
	let min = ref(0)
	let max = ref(100)
	let step = ref(1)
	watch(()=> status["setting"]["range"],()=>{
		let tmp = status["setting"]["range"]
		min.value = tmp[0] ? tmp[0]:0
		max.value = tmp[1] ? tmp[1]:100
		step.value = tmp[2] ? tmp[2]:1
	},{immediate:true})
	const newValue = ref(value)
</script>

<style lang="scss" scoped>

</style>