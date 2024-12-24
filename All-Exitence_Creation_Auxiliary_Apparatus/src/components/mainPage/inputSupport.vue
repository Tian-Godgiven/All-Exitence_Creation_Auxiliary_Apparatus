<template>
	<div class="inputSupport" v-show="inputSupportShowing" @click="(event)=>event.stopPropagation">
		<div class="autoComplete">联想输入</div>
		<div class="buttons">
			按键列表
		</div>
	</div>
</template>

<script setup lang="ts" name=""> 
	import { hideInputSupport, inputSupportShowing } from '@/hooks/inputSupport/inputSupport';
	import { onMounted, onUnmounted } from 'vue';

	//点击非inputSupport元素时，隐藏输入辅助框
	const clickListener = (event:any)=>{
		 // 使用 event.target.closest 判断是否点击了一个inputSupport元素或其子元素
		 const inputSupportElement = event.target.closest('[inputSupport]');
		// 如果点击的元素不是inputSupport元素或其子元素，隐藏输入辅助框
		if (!inputSupportElement) {
			hideInputSupport(); // 隐藏输入辅助框
		}
	}
	// 点击非输入区时失去焦点/隐藏输入辅助栏
    onMounted(()=>{
        document.body.addEventListener("click",clickListener,true)
    })
    // 卸载时移除监听
    onUnmounted(()=>{
        document.body.removeEventListener("click",clickListener,true)
    })
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
		z-index: 10000;
	}
</style>