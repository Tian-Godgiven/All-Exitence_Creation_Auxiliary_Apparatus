<template>
<ScrollBar>
<div class="container">
	<div class="top">
        <div class="title" :style="{'text-align':titleAlign}">
            <slot name="title"></slot>
        </div>
        <slot name="topBar"></slot>
    </div>
    <div class="inner" ref="inner">
        <slot name="inner"></slot>
    </div>
    <div class="info" v-if="ifInfo"> 
        <slot name="info"></slot>
    </div>
</div>
</ScrollBar>
</template>

<script setup lang='ts'>

import { toNumber } from 'lodash';
import { useTemplateRef } from 'vue';
import ScrollBar from '@/components/global/ScrollBar.vue';

    const {titleAlign="center",ifInfo=true} = defineProps<{
        titleAlign?:"center"|"right"|"left",//标题的对齐方向
        ifInfo?:boolean//是否显示Info框
    }>()
	defineExpose({
		getScrollTop,
		setScrollTop
	})
	//获取滚动高度
	const innerRef = useTemplateRef("inner")
	function getScrollTop(){
		if(innerRef.value)
		return toNumber(innerRef.value.scrollTop.toFixed(2))
	}
	//设定滚动高度
	function setScrollTop(scrollTop:number|"last"|"top"){
		if(!innerRef.value)return;
		if(scrollTop == "last"){
			scrollTop = innerRef.value.scrollHeight
		}
		else if(scrollTop == "top"){
			scrollTop = 0
		}
        innerRef.value.scrollTop = scrollTop
        
	}
</script>

<style scoped lang='scss'>	

.container{
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	.top{
		min-height: 70px;
		width: 100%;
		position: relative;
		display: flex;
		.title{
			min-height: 70px;
            width: 100%;
            flex-grow: 1;
			font-weight: bold;
			display: flex;
			align-items: center;
			justify-content: center;
			word-break: break-all;
			word-wrap: break-word;
			font-size: $midFontSize;
			color: $textColor;
		}
	}
	
	.inner{
		height: calc(100% - 110px);
		width: 100%;
		position: relative;
	}
	.info{
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		top:10px;
		right:20px;
		padding: 5px 12px;
		border-top-left-radius: 50px;  /* 左上角圆角 */
		border-top-right-radius: 50px; /* 右上角圆角 */
		border-bottom-left-radius: 50px; /* 左下角圆角 */
		border-bottom-right-radius: 50px; /* 右下角圆角 */
		background-color: rgba($antiBgColor,0.6);
		color: $bgColor;
		height: 30px;
		font-size: 20px;
		text-align: center;
		z-index: 2;
	}
}
</style>