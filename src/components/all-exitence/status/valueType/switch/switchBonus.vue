<template>
	<div class="switch">
		<div class="textInput">左侧：
			<downLineInputVue 
				@input="setStatus" v-model="leftText"/>
		</div>
		<div class="textInput">右侧：
			<downLineInputVue 
				@input="setStatus" v-model="rightText"/>
		</div>
	</div>
</template>

<script setup lang="ts" name=""> 
import { inject, ref } from 'vue'; 
import downLineInputVue from '@/components/other/input/downLineInput.vue';
	const status = inject<any>("status",{})
	let leftText = ref("")
	let rightText = ref("")
	//左右侧文本
	function setStatus(){
		status["setting"]["switch"] = [leftText.value,rightText.value]
	}
	setStatus()
</script>

<style lang="scss" scoped>
	@use "@/static/style/components/inputs.scss";
	.switch{
		display: flex;
		.textInput{
			@extend .halfInput;
		}
	}
</style>