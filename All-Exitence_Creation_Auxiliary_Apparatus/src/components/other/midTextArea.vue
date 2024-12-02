<template>
	<!-- 中等大小的输入区，用于弹出窗口内显示内容 -->
	<div
		contenteditable="true"
		rows="2"
		class="midTextArea"
		:placeholder="placeholder"
		auto-height
		@input="onInput"
		@blur="onBlur">
		{{  content }}
	</div>
</template>

<script lang="ts" setup>

	const {placeholder} = defineProps(["placeholder"])
	const content = defineModel()
	const emits = defineEmits(["blur"])
	function onInput(event){
		content.value = event.target.textContent
	}
	function onBlur(){
		emits('blur',content.value)
	}
</script>

<style lang="scss" scoped>
	.midTextArea{
		width: 100%;
		max-height: 200px;
		white-space: break-spaces;
		overflow: auto;
	}
</style>