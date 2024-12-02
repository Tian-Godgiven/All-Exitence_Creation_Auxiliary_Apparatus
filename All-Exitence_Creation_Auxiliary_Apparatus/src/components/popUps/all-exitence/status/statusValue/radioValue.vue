<template>
	<div class="radioValue">
		<radioVue class="radio" v-model="newValue" @change="changeStatusValue"></radioVue>
		<div class="text">{{text}}</div>
	</div>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue'; 
import radioVue from '@/components/other/radio.vue';
	const status = inject<any>("status")
	const changeStatusValue = inject<(value:any)=>any>("changeStatusValue",()=>{})
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