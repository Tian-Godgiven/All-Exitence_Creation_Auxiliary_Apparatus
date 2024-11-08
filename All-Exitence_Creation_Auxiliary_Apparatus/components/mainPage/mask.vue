<template>
	<view class="mask" 
		v-show="ifMask" 
		:style="{backgroundColor: `rgba(0, 0, 0, ${maskAlpha})`}"
		@click="clickMask"
	>
		
	</view>
</template>

<script setup lang="ts" name="mask">
import { ifMask,maskAlpha,clickMask } from '../../hooks/mask';
</script>

<style lang="scss" scoped>
	.mask{
		position: absolute;
		top:0;
		left:0;
		height: 100%;
		width: 100%;
		z-index: 4;
	}
</style>