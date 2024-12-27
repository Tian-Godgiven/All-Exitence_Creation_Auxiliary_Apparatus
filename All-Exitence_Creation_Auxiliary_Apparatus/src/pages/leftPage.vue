<template>
<div>
	<div class="leftPage" :style="{left:leftWidth}">
		<div class="titleBar">
			<div class="titleButtons">
				<div class="button">管理</div>
				<div class="button">搜索</div>
				<div class="button">展开收起</div>
				<div class="button" @click="createNew">新建</div>
				<div class="moreButton" @click="showMoreButton">
					显示更多
					<div v-show="showMore">
						<div>导入导出</div>
						<div>切换项目</div>
					</div>
				</div>
			</div>
			
			<div class="titleName" @click="changeModel">{{model?"万物":"文本"}}</div>
			
		</div>
		
		<div class="inner">
			<!-- 万物区 -->
			<allExitenceVue v-show="model"></allExitenceVue>
			<!-- 文本区 -->
			<allArticlesVue v-show="!model"></allArticlesVue>
			<!-- 底部填充区 -->
			<div class="scrollBottom"></div>
		</div>
	</div>


</div>
</template>

<script setup lang="ts" name="LeftPage">
import { leftMaxWidth, leftShowWidth } from '@/hooks/pages/pageChange';
import allExitenceVue from '@/components/leftPage/all-exitence/all-exitence.vue';
import allArticlesVue from '@/components/leftPage/all-articles/all-articles.vue';
import { computed, ref } from "vue"

import { createType } from '@/hooks/all-exitence/allExitence';
	//左侧宽度
	const leftWidth = computed(()=>{
		return (leftShowWidth.value - leftMaxWidth)+'px'
	})

	// true = [万物] false = [文本]
	let model = ref(true)
	function changeModel(){
		model.value = !model.value
	}
	
	const showMore = ref(false)
	function showMoreButton(){
		showMore.value = !showMore.value
	}
	
	function createNew(){
		//万物类
		if(model){
			createType()
		}
	}
	
	
</script>

<style lang="scss" scoped>
	@use "@/static/style/leftPage.scss";
	.leftPage{
		@extend .leftPage;
		
	}

</style>