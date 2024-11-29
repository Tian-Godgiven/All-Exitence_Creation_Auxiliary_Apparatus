<template>
	<view class="switch">
		<view class="textInput">左侧：<input @input="setStatus" v-model="leftText"/></view>
		<view class="textInput">右侧：<input @input="setStatus" v-model="rightText"/></view>
	</view>
</template>

<script setup lang="ts" name=""> 
import { computed, inject, ref } from 'vue'; 
	const status = inject("status")
	let leftText = ref("")
	let rightText = ref("")
	//左右侧文本
	function setStatus(){
		status["setting"]["switch"] = [leftText.value,rightText.value]
	}
	setStatus()
</script>

<style lang="scss" scoped>
	@import "@/static/style/components/inputs.scss";
	.switch{
		display: flex;
		.textInput{
			@extend .halfInput;
		}
	}
</style>