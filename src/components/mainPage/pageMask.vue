<template>
	<!-- 左侧页面专用的mask遮罩层 -->
	<div class="leftPageMask"
		v-show="ifMask" 
		:style="{
			backgroundColor: `rgba(0, 0, 0, ${maskAlpha})`}"
		@click="clickMask">
	</div>
</template>

<script setup lang='ts'>
    import { ifMask,maskAlpha,clickMask } from '@/hooks/pages/masks/pageMask';
</script>

<style scoped lang='scss'>
    .leftPageMask{
		position: absolute;
		left:0;
		top:0;
		width: 100vw;
		height: 100vh;
		z-index: 1;
	}
</style>