<template>
	<view class="inputBox">
		<textarea auto-height v-model="newValue" @blur="changeStatusValue(newValue)"> </textarea>
	</view>
</template>

<script setup lang="ts" name="">
import { inject, ref } from 'vue'; 
	const {value} = defineProps(["value"])
	const changeStatusValue = inject("changeStatusValue")
	const newValue = ref(value)
</script>

<style lang="scss" scoped>
	.inputBox{
		width: 100%;
		textarea{
			overflow: auto;
			width: 100%;
			max-height: 300rpx;
			border:1px solid black
		}
	}
</style>