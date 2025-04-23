<template>
<div class="leftPage" :style="{left:leftWidth}">
	<div class="top">
		<Button class="title" :class="nowLeftManage?'manageMode':''" 
			@click="title.click" :name="title.name">
		</Button>
		<div class="buttons">
			<Button name="管理" @click="switchManageMode" icon="manage"></Button>
			<Button name="搜索" @click="" icon="search"></Button>
			<Button :name="allExpending?'收起':'展开'" 
				@click="switchExpending" 
				:icon="allExpending?'allFold':'allExpend'">
			</Button>
			<Button name="新建" @click="createNew"></Button>
			<div class="moreButton" @click="showMoreButton">
				显示更多
				<div v-show="showMore">
					<div>导入导出</div>
					<div>切换项目</div>
				</div>
			</div>
		</div>
		
	</div>
	<div class="inner">
		<allExitenceVue v-show="model"></allExitenceVue>
		<allArticlesVue v-show="!model"></allArticlesVue>
		<div class="scrollBottom"></div>
	</div>
</div>
</template>

<script setup lang="ts" name="LeftPage">
	import { leftMaxWidth, leftShowWidth } from '@/hooks/pages/pageChange';
	import allExitenceVue from '@/components/leftPage/all-exitence/all-exitence.vue';
	import allArticlesVue from '@/components/leftPage/all-articles/all-articles.vue';
	import { computed, ref } from "vue"
	import { createTypePopUp, nowAllExitence } from '@/hooks/all-exitence/allExitence';
	import { addChapterPopUp, nowAllArticles } from '@/hooks/all-articles/allArticles';
	import { Type } from '@/class/Type';
	import { Chapter } from '@/class/Chapter';
	import { changeLeftPageMode, nowLeftManage, nowLeftPageMode } from '@/hooks/pages/leftPage';
	import Button from '@/components/global/Button.vue';	
	//左侧宽度
	const leftWidth = computed(()=>{
		//出现变化时关闭管理模式
		nowLeftManage.value = false
		return (leftShowWidth.value - leftMaxWidth)+'px'
	})

	// 当前模式 true = [万物] false = [文本]
	const model = computed(()=>{
		if(nowLeftPageMode.value == "all-exitence"){
			return true
		}
		return false
	})

	//当前显示的标题
	const title = computed(()=>{
		if(nowLeftManage.value){
			return {
				name:"结束管理",
				click:switchManageMode
			}
		}
		return {
			name:model.value?"万物":"文章",
			click:()=>changeLeftPageMode()
		}
	})

	//点击切换管理模式:管理万物中的分类/分组+管理章节
	function switchManageMode(){
		nowLeftManage.value = !nowLeftManage.value;
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
	
	//创建新分类/章节
	function createNew(){
		//万物类
		if(model.value){
			createTypePopUp()
		}
		else{
			addChapterPopUp()
		}
	}
	
	
</script>

<style lang="scss" scoped>
.leftPage{
	top:0; 
	height: 100%;
	width: 650px;
	background-color: $bgColor;
	position: absolute;
	z-index: 5;
	> .top{
		width:100%;
		word-break: break-all;
		background-color: $bgColor;
		height: 110px;
		display: flex;
		position: relative;
		z-index: 1;
		box-sizing: border-box;
		border-bottom: 3px solid $bgColor70;
		.title{
			flex-grow: 1;
			display: flex;
			align-items: center;
			font-weight: 600;
			width: 250px;
			height: 100%;
			font-size: $bigFontSize;
			&.manageMode{
				font-size: 1.8rem;
			}
		}
		.buttons{
			height: 100%;
			display: flex;
			width: 400px;
			.button{
				width: 100px;
				height: 100%;
				box-sizing: border-box;
			}
		}
	}
	> .inner{
		overflow: auto;
		scrollbar-width: none;
		height: calc(100% - 110px);
		scroll-p{
			height: 100%;
			.scrollBottom{
				height: 30%;
			}
		}
	}
}

</style>