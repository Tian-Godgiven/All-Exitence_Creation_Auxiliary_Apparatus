<template>
	<div class="textInput">
		<div class="input">
			<textAreaVue
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
	import { closePopUp } from '../../../hooks/popUp';
	const inputText = ref("")
	const {returnValue,popUp} = defineProps(["returnValue","popUp"])
	function confirm(){
		returnValue(inputText.value)
		closePopUp(popUp)
	}
</script>

<style lang="scss" scoped>
	@use "@/static/style/components/popUpButtons.scss";
	.textInput{
		width: 100%;
		max-height: 300px;
		.input{
			width: 100%;
		}
		.buttons{
			@extend .buttons
		}
	}
	
</style>