<template>
	<view class="radioValue">
		<radioVue class="radio" v-model="newValue" @change="changeStatusValue"></radioVue>
		<view class="text">{{text}}</view>
	</view>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue'; 
import radioVue from '../../../other/radio.vue';
	const status = inject("status")
	const changeStatusValue = inject("changeStatusValue")
	const newValue = ref(status['value'])
	const text = computed(()=>{
		return status["setting"]["radio"]
	})
</script>

<style scoped lang="scss">
	.radioValue{
		display: flex; 
		height: 100%;
	}
</style>