<template>
<div>
	<div class="leftPage" :style="{left:leftWidth}">
		<div class="titleBar">
			<div class="titleButtons">
				<div class="button" @click="switchManage">管理</div>
				<div class="button">搜索</div>
				<div class="button" @click="switchExpending">展开收起</div>
				<div class="button" @click="createNew">新建</div>
				<div class="moreButton" @click="showMoreButton">
					显示更多
					<div v-show="showMore">
						<div>导入导出</div>
						<div>切换项目</div>
					</div>
				</div>
			</div>
			
			<div class="titleName manageName" @click="switchManage" v-show="manageMode">结束管理</div>
			<div class="titleName" @click="changeModel" v-show="!manageMode">{{model?"万物":"文本"}}</div>
			
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
import { computed, provide, ref } from "vue"
import { createType, nowAllExitence } from '@/hooks/all-exitence/allExitence';
import { createChapter, nowAllArticles } from '@/hooks/all-articles/allArticles';
import { Type } from '@/class/Type';
import { Chapter } from '@/class/Chapter';
	//左侧宽度
	const leftWidth = computed(()=>{
		//出现变化时关闭管理模式
		manageMode.value = false
		return (leftShowWidth.value - leftMaxWidth)+'px'
	})

	// true = [万物] false = [文本]
	let model = ref(true)
	function changeModel(){
		model.value = !model.value
	}

	//点击切换管理模式:管理万物中的分类/分组+管理章节
	const manageMode = ref(false)
	provide("manageMode",manageMode)
	function switchManage(){
		manageMode.value = !manageMode.value;
	}

	//点击展开/收起当前所有内容
	const allExpending = ref(true) //展开全部状态
	function switchExpending(){
		//展开or收起万物
		if(model.value){
			nowAllExitence.types.forEach((type:Type) => {
				//将其展开or收起
				type.expending = allExpending.value;
				//将其中的分组展开or收起
				type.groups.forEach((group)=>{
					group.expending = allExpending.value;
				})
			});
		}
		//展开or收起文章
		else{
			nowAllArticles.chapters.forEach((chapter)=>{
				//递归展开or收起所有章节
				expandingChapter(chapter)
			})
			function expandingChapter(chapter:Chapter){
				//将其展开or收起
				chapter.expending = allExpending.value;
				//将其中的章节展开or收起
				chapter.chapters.forEach((chapter)=>{
					expandingChapter(chapter)
				})
			}
		}
		//切换状态
		allExpending.value = !allExpending.value;
	}

	//点击显示更多
	const showMore = ref(false)
	function showMoreButton(){
		showMore.value = !showMore.value
	}
	
	//创建新对象
	function createNew(){
		//万物类
		if(model.value){
			createType()
		}
		else{
			createChapter()
		}
	}
	
	
</script>

<style lang="scss" scoped>
	@use "@/static/style/leftPage.scss";
	.leftPage{
		@extend .leftPage;
	}

</style>