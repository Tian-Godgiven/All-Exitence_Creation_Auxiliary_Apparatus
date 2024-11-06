<template>
	<view class="rightPage" 
		:style="{
			width:maxWidth+'px', 
			right:(showWidth - maxWidth < 0? showWidth-maxWidth:0) +'px'
		}"
	>
		999
	</view>
</template>

<script setup lang="ts" name="">
	// 由于右侧页面是从右往左的，因此实际设定的是该页面的right属性
	let {showWidth,maxWidth} = defineProps(["showWidth","maxWidth"])
</script>

<style lang="scss">
	.rightPage{
		position: absolute;
		height: 100vh;
		background-color: red;
	}
</style>