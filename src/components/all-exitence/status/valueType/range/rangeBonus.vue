<template>
<!-- 范围输入栏 -->
<div class="rangeBonus">
	<div class="top">
		<div class="halfInput">下限值:
			<downLineInputVue
				@input="adjustRange" 
				v-model.number="rangeMin" 
				type="number"/>
		</div>
		<div class="halfInput">上限值:
			<downLineInputVue
				@input="adjustRange" 
				v-model.number="rangeMax" 
				type="number"/>
		</div>
	</div>
	<div class="halfInput" >单位值:
		<downLineInputVue
			@input="adjustStep" 
			v-model.number="rangeStep" 
			type="number"/>
	</div>
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
		.top{
			display: flex;
		}
	}
	.halfInput{
		@extend .halfInput;
	}
</style>