<template>
	<div class="textInput">
		<div class="input">
			<textAreaVue
				:mode="mode"
				v-model="inputText"
				placeholder="请输入文本内容">
			</textAreaVue>
		</div>
		<div class="buttons">
			<div class="button" @click="confirm()">确认</div>
			<div class="button" @click="closePopUp(popUp)">取消</div>
		</div>
	</div>
</template>

<script setup lang="ts" name=""> 
	import { ref } from 'vue';
	import textAreaVue from '@/components/other/textArea/textArea.vue';
	import { closePopUp } from '@/hooks/pages/popUp';
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
	@use "@/static/style/popUp.scss";
	.textInput{
		width: 100%;
		max-height: 300px;
		.input{
			width: 100%;
		}
		.buttons{
			@extend .finalButtons;
		}
	}
	
</style>