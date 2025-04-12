<template>
	<!-- 页面专用的mask遮罩层 -->
	<div class="pageMask"
		v-show="ifMask" 
		:style="{
			backgroundColor: `rgba(0, 0, 0, ${maskAlpha})`}"
		@click="clickMask">
	</div>
</template>

<script setup lang='ts'>
    import { ifMask,maskAlpha,clickMask } from "@/hooks/pages/masks/pageMask.ts"
</script>

<style scoped lang='scss'>
    .pageMask{
		position: absolute;
		left:0;
		top:0;
		width: 100vw;
		height: 100vh;
		z-index: 1;
	}
</style>