<template>
	<div class="value">
		<component :disabled="disabled" :is="statusValueVueList[valueType]"></component>
	</div>
</template>

<script setup lang="ts" name="">
import {computed, inject } from 'vue'; 
import { statusValueVueList } from '@/data/list/statusValueList';
	let status = inject<any>("status")
	const {disabled} = defineProps(["disabled"])
	let valueType = computed(()=>{
		return status["valueType"]
	})
</script>

<style lang="scss" scoped>
	.value{
		width: 100%;
	}
</style>