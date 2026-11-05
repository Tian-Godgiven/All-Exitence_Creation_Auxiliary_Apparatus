<template>
<!-- 范围输入栏 -->
<div class="rangeBonus">
		<div class="rangeFields">
			<label class="field">
				<span>下限</span>
			<downLineInputVue
				@input="adjustRange" 
				v-model.number="rangeMin" 
					type="number"/>
			</label>
			<span class="rangeSeparator">至</span>
			<label class="field">
				<span>上限</span>
			<downLineInputVue
				@input="adjustRange" 
				v-model.number="rangeMax" 
					type="number"/>
			</label>
	</div>
		<label class="field stepField">
			<span>步长</span>
		<downLineInputVue
			@input="adjustStep" 
			v-model.number="rangeStep" 
				type="number"/>
		</label>
</div>
</template>
	
<script lang="ts" setup>
import { ref} from 'vue';
import { showQuickInfo } from '@/api/showQuickInfo';
import Status from '@/interfaces/Status';
import downLineInputVue from '@/components/other/input/downLineInput.vue';
import { ExitenceStatus } from '@/class/Exitence';
import { getStatusSettingValue, setStatus } from '@/hooks/all-exitence/status';
	const {status,fullStatus} = defineProps<{
        status:Status|ExitenceStatus,
        fullStatus:Status
    }>()
	const range = getStatusSettingValue<number>(fullStatus.setting,"range","arr")
		??[0,100,1]
	// 范围输入栏
	let rangeMin = ref(range[0])
	let rangeMax = ref(range[1])
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
	
	let rangeStep = ref(range[2])
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
		setStatus(status,"range",[rangeMin.value,rangeMax.value,rangeStep.value])
	}
	changeStatus()
</script>
 
<style lang="scss" scoped>
	@use "@/static/style/components/inputs.scss";
	.rangeBonus{
		width: 100%;
		max-width: 600px;
		min-width: 0;
		.rangeFields{
			display: flex;
			align-items: center;
			gap: 8px;
		}
		.field{
			display: flex;
			align-items: center;
			gap: 6px;
			flex: 1 1 0;
			min-width: 0;
			span{ flex: 0 0 auto; }
			:deep(.downLineInput){
				flex: 1 1 0;
				min-width: 0;
				border: 1px solid $inputBorderColor;
				border-radius: 4px;
				padding: 0 8px;
				box-sizing: border-box;
				min-height: 40px;
				.downLine{ display: none; }
				.input{
					min-height: 38px;
					padding: 0;
					text-align: right;
				}
			}
		}
		.rangeSeparator{ flex: 0 0 auto; color: $previewText; }
		.stepField{ width: calc(50% - 12px); margin-top: 8px; }
	}
	@media (max-width: 899px){
		.rangeBonus{
			.rangeFields{ flex-wrap: wrap; }
			.rangeFields .field{ flex-basis: calc(50% - 16px); }
		}
	}
</style>
