<template>
<div class="container">
    <div class="top" :class="ifInfo?'showInfo':''">
        <div class="targetTitle" :style="{
            'text-align':titleAlign,
        }">
            <slot name="title"></slot>
        </div>
        <div>
            <slot  name="topBar"></slot>
        </div>
    </div>
    
    <div class="targetInner">
        <slot name="inner"></slot>
    </div>
    <div class="targetInfo" v-if="ifInfo"> 
        <slot name="info"></slot>
    </div>
</div>
</template>

<script setup lang='ts'>
    const {titleAlign="center",ifInfo=true} = defineProps<{
        titleAlign?:"center"|"right"|"left",//标题的对齐方向
        ifInfo?:boolean//是否显示Info框
    }>()
</script>

<style scoped lang='scss'>
.container{
	width: 100%;
	height: 100%;
	.top{
		min-height: 70px;
		width: 100%;
		position: relative;
		display: flex;
        &.showInfo{
            padding-top: 40px;
        }
		.targetTitle{
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
	
	.targetInner{
		height: calc(100% - 110px);
		overflow: auto;
		width: 100%;
		position: relative;
	}
	.targetInfo{
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		top:0;
		right:0;
		padding: 5px 12px;
		border-top-left-radius: 50px;  /* 左上角圆角 */
		border-top-right-radius: 50px; /* 右上角圆角 */
		border-bottom-left-radius: 50px; /* 左下角圆角 */
		border-bottom-right-radius: 50px; /* 右下角圆角 */
		background-color: $textNumColor;
		height: 30px;
		font-size: 25px;
		text-align: center;
		z-index: 2;
	}
}
</style>