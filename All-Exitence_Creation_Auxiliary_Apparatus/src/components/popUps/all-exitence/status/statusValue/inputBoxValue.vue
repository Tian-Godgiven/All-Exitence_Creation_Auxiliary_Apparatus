<template>
	<div class="inputBox">
		<textAreaVue 
			:disabled="disabled"
			class="input"
			v-model="status.value"
			placeholder="输入默认值">
		</textAreaVue>
	</div>
</template>

<script setup lang="ts" name="">
import { inject } from 'vue'; 
import textAreaVue from '@/components/other/textArea/textArea.vue';
	const status = inject<any>("status")
	const {disabled} = defineProps(["disabled"])
</script>

<style lang="scss" scoped>
	.inputBox{
		width: 100%;
		height: 100%;
		overflow: auto;
		border:3px solid black;
	}
</style>