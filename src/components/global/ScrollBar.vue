<template>
<ElScrollbar ref="scrollBarRef" class="scrollBar" 
    :wrap-style="{ backgroundColor: '#ffffff' }" 
    :view-style="{ backgroundColor: '#ffffff' }">
    <slot></slot>
</ElScrollbar>
</template>

<script setup lang='ts'>
    import { useTemplateRef } from 'vue';
    import { ElScrollbar } from 'element-plus';

	const scrollBarRef = useTemplateRef("scrollBarRef")
	function getScrollTop(){
		return scrollBarRef.value?.wrapRef?.scrollTop ?? 0
	}
	function setScrollTop(scrollTop:number){
		scrollBarRef.value?.setScrollTop(scrollTop)
	}
	defineExpose({ getScrollTop, setScrollTop })
</script>

<style scoped lang='scss'>
.scrollBar{
	width: 100%;
	height: 100%;
	overflow-y: auto;
	overflow-x: hidden;
	:deep(.el-scrollbar__thumb) {
		background-color:rgb(0, 0, 0);
	}
}
</style>
