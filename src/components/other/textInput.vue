<template>
	<div class="textInput">
		<div class="input">
			<textAreaVue
				:mode="mode"
				v-model="inputText"
				placeholder="请输入文本内容">
			</textAreaVue>
		</div>
		<FinalButtons :buttons="[
			{click:confirm,name:'确认'},
			{click:()=>closePopUp(popUp),name:'取消'}]"/>
	</div>
</template>

<script setup lang="ts" name=""> 
	import { ref } from 'vue';
	import textAreaVue from '@/components/other/textArea/textArea.vue';
	import { closePopUp } from '@/hooks/pages/popUp';
	import FinalButtons from '@/app/stacks/popUp/FinalButtons.vue';

	const inputText = ref("")
	const {props={},returnValue,popUp} = defineProps(["props","returnValue","popUp"])
	//纯文本or文件文本
	const mode = props?.mode
	function confirm(){
		returnValue(inputText.value)
		closePopUp(popUp)
	}
</script>

<style lang="scss" scoped>
	.textInput{
		width: 100%;
		max-height: 300px;
		.input{
			width: 100%;
		}
	}
	
</style>