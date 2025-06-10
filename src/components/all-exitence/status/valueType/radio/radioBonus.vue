<template>
	<div class="radio">
		<div class="textInput">文本：
			<downLineInputVue
				@input="inputValue" v-model="text"/>
		</div>
	</div>
</template>

<script setup lang="ts" name=""> 
import { onMounted, ref } from 'vue'; 
import downLineInputVue from '@/components/other/input/downLineInput.vue';
import Status from '@/interfaces/Status';
import { ExitenceStatus } from '@/class/Exitence';
import { getStatusSettingValue, setStatus } from '@/hooks/all-exitence/status';
	const {status,fullStatus} = defineProps<{
        status:Status|ExitenceStatus,
        fullStatus:Status
    }>()
	const text = ref("")
	onMounted(()=>{
		const radioValue = getStatusSettingValue(fullStatus.setting,"radio","string")
		if(!radioValue){
			inputValue()
		}
		else{
			text.value = radioValue
		}
	})
	
	function inputValue(){
		setStatus(status,"radio",text.value)
	}
</script>

<style lang="scss" scoped>
	@use "@/static/style/components/inputs.scss";
	.radio{
		.textInput{
			display: flex;
			white-space: nowrap;
			width: 100%;
			input{
				width:calc(100% - 100px);
				text-align: left;
			}
		}
	}
</style>