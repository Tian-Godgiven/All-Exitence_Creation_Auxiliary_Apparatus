<template>
	<view class="textInput">
		<view class="input">
			<midTextAreaVue v-model="inputText" placeholder="请输入文本内容"></midTextAreaVue>
		</view>
		<view class="buttons">
			<view class="button" @click="confirm()">确认</view>
			<view class="button" @click="closePopUp(popUp)">取消</view>
		</view>
	</view>
</template>

<script setup lang="ts" name=""> 
	import { ref } from 'vue';
	import midTextAreaVue from '../../other/midTextArea.vue';
	import { closePopUp } from '../../../hooks/popUp';
	const inputText = ref("")
	const {returnValue,popUp} = defineProps(["returnValue","popUp"])
	function confirm(){
		returnValue(inputText.value)
		closePopUp(popUp)
	}
</script>

<style lang="scss" scoped>
	@import "@/static/style/components/popUpButtons.scss";
	.textInput{
		width: 100%;
		max-height: 300rpx;
		.input{
			width: 100%;
		}
		.buttons{
			@extend .buttons
		}
	}
	
</style>