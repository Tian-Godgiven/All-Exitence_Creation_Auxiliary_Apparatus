<template>
	<div class="mask" 
		v-show="ifMask" 
		:style="{
			zIndex:zIndex,
			backgroundColor: `rgba(0, 0, 0, ${maskAlpha})`}"
		@click="clickMask"
	>
		
	</div>
</template>

<script setup lang="ts" name="mask">
import { computed } from 'vue';
import { ifMask,maskAlpha,clickMask } from '../../hooks/mask';
import { maskIndex } from '../../hooks/popUp';

	let zIndex = computed(()=>{
		return maskIndex.value-1
	})
	
</script>

<style lang="scss" scoped>
	.mask{
		position: absolute;
		top:0;
		left:0;
		height: 100%;
		width: 100%;
		pointer-events: auto;
	}
</style>