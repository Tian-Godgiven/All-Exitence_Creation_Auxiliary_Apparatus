<template>
<ElScrollbar class="scrollBar" 
    :wrap-style="{ backgroundColor: '#ffffff' }" 
    :view-style="{ backgroundColor: '#ffffff' }">
    <slot></slot>
</ElScrollbar>
</template>

<script setup lang='ts'>
    import { ElScrollbar } from 'element-plus';
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