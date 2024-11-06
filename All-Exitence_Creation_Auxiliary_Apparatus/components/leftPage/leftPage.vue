<template>
	<view class="leftPage" 
		:style="{
			width:maxWidth+'px',
			left:(showWidth - maxWidth < 0? showWidth-maxWidth:0)+'px'
		}"
	>
		123
	</view>
</template>

<script setup lang="ts" name="leftPage">
	let {showWidth,maxWidth} = defineProps(["showWidth","maxWidth"])
</script>

<style lang="scss">
	.leftPage{
		position: absolute;
		height: 100vh;
		background-color: black;
	}
</style>