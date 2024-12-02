<template>
	<div class="inputSupport">
		<div class="autoComplete">联想输入</div>
		<div class="buttons">
			按键列表
		</div>
	</div>
</template>

<script setup lang="ts" name=""> 

</script>

<style lang="scss" scoped>
	@use "@/static/style/global.scss" as global;
	.inputSupport{
		display: flex;
		width: 100%;
		height: 50px;
		background-color: global.$buttonColor;
		position: absolute;
		bottom: 0;
		left: 0;
	}
</style>