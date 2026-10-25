<template>
<div class="container">
	<div class="top">
		<div class="title" :style="{
			'text-align':titleAlign,
			'justify-content':titleAlign == 'left' ? 'flex-start' : titleAlign == 'right' ? 'flex-end' : 'center'
		}">
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
</template>

<script setup lang='ts'>
import { toNumber } from 'lodash';
import { useTemplateRef } from 'vue';

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
		min-height: 40px;
		width: 100%;
		position: relative;
		display: flex;
		z-index: 2;
		.title{
			min-height: 40px;
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
		height: calc(100% - 40px);
		width: 100%;
		position: relative;
		z-index: 1;
	}
	.info{
		position: absolute;
		display: flex;
		align-items: flex-end;
		top:10px;
		right:20px;
		font-size: 13px;
		text-align: right;
		z-index: 2;
	}
}
</style>
