<template>
	<view class="leftPage" 
		:style="{left:(showWidth-maxWidth)+'px'}">
	</view>
</template>

<script setup lang="ts" name="LeftPage">
import { ref } from 'vue';
import { leftMaxWidth } from '../../hooks/pageChange';
	let {showWidth} = defineProps(["showWidth","maxWidth"])
	let maxWidth = leftMaxWidth
</script>

<style lang="scss">
	@import "@/static/style/leftPage.scss";
	.leftPage{
		top:0;
		height: 100vh;
		width:$leftPageWidth;
		background-color: black;
		position: absolute;
		z-index: 3;
	}
</style>