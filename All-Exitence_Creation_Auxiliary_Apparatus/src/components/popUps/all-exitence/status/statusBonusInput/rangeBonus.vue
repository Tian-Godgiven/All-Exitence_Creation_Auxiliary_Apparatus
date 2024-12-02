<template>
	<!-- 范围输入栏 -->
	<div class="range">
		<div class="top">
			<div class="halfInput">下限值:
				<input @input="adjustRange" v-model.number="rangeMin" type="number"/>
			</div>
			<div class="halfInput">上限值:
				<input @input="adjustRange" v-model.number="rangeMax" type="number"/>
			</div>
		</div>
		<div class="halfInput" >单位值:
			<input @input="adjustStep" v-model.number="rangeStep" type="number"/>
		</div>
	</div>
</template>
	
<script lang="ts" setup>
import { inject, ref} from 'vue';
import { showQuickInfo } from '@/api/showQuickInfo';
import Status from '@/interfaces/exitenceStatus';
	const status = inject<Status>('status'); 
	if(!status){
		alert("没有属性传入")
	}
	// 范围输入栏
	let rangeMin = ref(0)
	let rangeMax = ref(100)
	// 调整最大最小值
	function adjustRange(){
		if (rangeMin.value > rangeMax.value) {
		  rangeMax.value = rangeMin.value + rangeStep.value;
		}
		if (rangeMax.value < rangeMin.value) {
		  rangeMin.value = rangeMax.value - rangeStep.value;
		}
		changeStatus()
	};
	
	let rangeStep = ref(1)
	// 调整步长
	function adjustStep(){
		if(rangeStep.value<0){
			showQuickInfo("单位值不能小于0")
			rangeStep.value = 1
		}
		changeStatus()
	}
	
	// 修改属性
	function changeStatus(){
		status["setting"]["range"] = [rangeMin.value,rangeMax.value,rangeStep.value]
	}
	changeStatus()
</script>
 
<style lang="scss">
	@use "@/static/style/components/inputs.scss";
	.range{
		.top{
			display: flex;
		}
	}
	.halfInput{
		@extend .halfInput;
	}
</style>