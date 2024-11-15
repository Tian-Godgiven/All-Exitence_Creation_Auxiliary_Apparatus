<template>
	<view class="mask" 
		v-show="ifMask" 
		:style="{
			zIndex:4+zIndex,
			backgroundColor: `rgba(0, 0, 0, ${maskAlpha})`}"
		@click="clickMask"
	>
		
	</view>
</template>

<script setup lang="ts" name="mask">
import { ref, watch } from 'vue';
import { ifMask,maskAlpha,clickMask } from '../../hooks/mask';
import { popUpList } from '../../hooks/popUp';

	let zIndex = ref(0)
	watch(popUpList,()=>{
		if(popUpList.length > 0){
			zIndex.value = popUpList.length + 1
		}
		else{
			zIndex.value = 0
		}
	})
	
	
</script>

<style lang="scss" scoped>
	.mask{
		position: absolute;
		top:0;
		left:0;
		height: 100%;
		width: 100%;
	}
</style>