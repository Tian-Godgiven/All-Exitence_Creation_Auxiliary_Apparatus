<template>
	<div class="inputBox">
		<textAreaVue 
			class="input"
			v-model="newValue"
			@blur="changeStatusValue(newValue)">
		</textAreaVue>
	</div>
</template>

<script setup lang="ts" name="">
import { inject, ref } from 'vue'; 
import textAreaVue from '@/components/other/textArea/textArea.vue';
	const {value} = defineProps(["value"])
	const changeStatusValue = inject("changeStatusValue")
	const newValue = ref(value)
</script>

<style lang="scss" scoped>
	.inputBox{
		width: 100%;
		height: 100%;
		overflow: auto;
		border:3px solid black;
	}
</style>