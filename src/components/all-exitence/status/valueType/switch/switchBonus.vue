<template>
<div class="switchBonus">
	<div class="textInput">左侧：
		<downLineInputVue 
			@input="setSwitchText" v-model="leftText"/>
	</div>
	<div class="textInput">右侧：
		<downLineInputVue 
			@input="setSwitchText" v-model="rightText"/>
	</div>
</div>
</template>

<script setup lang="ts" name=""> 
import { ref } from 'vue'; 
import downLineInputVue from '@/components/other/input/downLineInput.vue';
import Status from '@/interfaces/Status';
import { ExitenceStatus } from '@/class/Exitence';
import { getStatusSettingValue, setStatus } from '@/hooks/all-exitence/status';
	const {status,fullStatus} = defineProps<{
        status:Status|ExitenceStatus,
        fullStatus:Status
    }>()
	const switchValue = getStatusSettingValue<string>(fullStatus.setting,"switch","arr")??["",""]
	let leftText = ref(switchValue[0])
	let rightText = ref(switchValue[1])
	//左右侧文本
	function setSwitchText(){
		setStatus(status,"switch",[leftText.value,rightText.value])
	}
	setSwitchText()
</script>

<style lang="scss" scoped>
@use "@/static/style/components/inputs.scss";
.switchBonus{
	display: flex;
	.textInput{
		@extend .halfInput;
	}
}
</style>