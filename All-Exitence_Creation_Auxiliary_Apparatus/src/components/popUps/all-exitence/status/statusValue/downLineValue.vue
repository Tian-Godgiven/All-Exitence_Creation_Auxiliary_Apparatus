<template>
	<div class="downLineValue">
		<textAreaVue
			class="textArea"
			v-model="newValue"
			placeholder="输入默认值"
			@blur="changeStatusValue" />
	</div>
</template>

<script setup lang="ts" name="">
import { inject, ref } from 'vue'; 
import textAreaVue from '@/components/other/textArea/textArea.vue';

	const {value} = defineProps(["value"])
	const changeStatusValue = inject<()=>{}>("changeStatusValue")
	const newValue = ref(value)
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