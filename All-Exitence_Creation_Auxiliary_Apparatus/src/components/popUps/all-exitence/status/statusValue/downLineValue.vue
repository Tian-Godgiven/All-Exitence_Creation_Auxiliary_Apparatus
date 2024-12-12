<template>
	<div class="downLineValue">
		<textAreaVue
			:disabled="disabled"
			class="textArea"
			v-model="status.value"
			placeholder="输入默认值"
			 />
	</div>
</template>

<script setup lang="ts" name="">
import { inject } from 'vue'; 
import textAreaVue from '@/components/other/textArea/textArea.vue';
	const status = inject<any>("status")
	const {disabled} = defineProps(["disabled"])
</script>

<style lang="scss" scoped>
	.downLineValue{
		width: 100%;
		.textArea{
			text-decoration: underline;
			text-decoration-color: inherit;
		}
	}
</style>