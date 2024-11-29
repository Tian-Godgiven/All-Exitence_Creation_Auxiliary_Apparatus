<template>
	<midTextAreaVue 
		class="downLine" 
		v-model="newValue" 
		placeholder="输入默认值" 
		@blur="changeStatusValue">
	</midTextAreaVue>
</template>

<script setup lang="ts" name="">
import { computed, inject, ref } from 'vue'; 
import midTextAreaVue from '../../../other/midTextArea.vue';

	const {value} = defineProps(["value"])
	const changeStatusValue = inject("changeStatusValue")
	const newValue = ref(value)
</script>

<style lang="scss" scoped>
	.downLine{
		text-decoration: underline;
		width: 100%;
	}
</style>