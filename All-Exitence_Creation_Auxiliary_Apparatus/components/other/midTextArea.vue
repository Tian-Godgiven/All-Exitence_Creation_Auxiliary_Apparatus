<template>
	<!-- 中等大小的输入区，用于弹出窗口内显示内容 -->
	<textarea
		rows="2"
		class="midTextArea"
		:placeholder="placeholder"
		v-model="value"
		auto-height
		@blur="emits('blur',value)">
	</textarea>
</template>

<script lang="ts" setup>
	const {placeholder} = defineProps(["placeholder"])
	const value = defineModel()
	const emits = defineEmits(["blur"])
</script>

<style lang="scss" scoped>
	.midTextArea{
		width: 100%;
		max-height: 200rpx;
		white-space: break-spaces;
		overflow: auto;
	}
</style>