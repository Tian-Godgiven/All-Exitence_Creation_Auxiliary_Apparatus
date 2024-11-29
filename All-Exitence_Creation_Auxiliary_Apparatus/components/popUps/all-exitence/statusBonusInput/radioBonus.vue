<template>
	<view class="radio">
		<view class="textInput">文本：<input @input="setStatus" v-model="text"/></view>
	</view>
</template>

<script setup lang="ts" name=""> 
import { inject, ref, watch } from 'vue'; 
	const status = inject("status")
	const text = ref("")
	function setStatus(){
		status["setting"]["radio"] = text.value
	}
	setStatus()
</script>

<style lang="scss" scoped>
	@import "@/static/style/components/inputs.scss";
	.radio{
		.textInput{
			display: flex;
			white-space: nowrap;
			width: 100%;
			input{
				width:calc(100% - 100rpx);
				text-align: left;
			}
		}
	}
</style>