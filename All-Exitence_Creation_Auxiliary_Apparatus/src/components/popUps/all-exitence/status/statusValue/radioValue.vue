<template>
	<div class="radioValue">
		<radioVue class="radio" v-model="status.value"></radioVue>
		<div class="text">{{text}}</div>
	</div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'; 
import radioVue from '@/components/other/radio.vue';
	const status = inject<any>("status")
	const {statusSetting} = defineProps(['statusSetting'])
	const text = computed(()=>{
		return statusSetting["radio"]
	})
</script>

<style scoped lang="scss">
	.radioValue{
		display: flex; 
		height: 100%;
	}
</style>