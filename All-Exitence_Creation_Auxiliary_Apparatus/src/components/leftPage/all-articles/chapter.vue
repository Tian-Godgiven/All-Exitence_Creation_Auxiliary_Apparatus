<template>
	<expendableContainerVue
		class="chapter"
		@longTap="longtap"
		:buttons="buttons">
		<template v-slot:title><div class="text">{{ chapter.name }}</div></template>
		<template v-slot:inner>
			<!-- 章节内的文本 -->
			<div v-for="(article,index) in articles">
				<articleVue 
					:from="chapter" 
					:article = "article">
				</articleVue>
				<div class="separator" v-if="index < articles.length-1"></div>
			</div>
			<!-- 章节内的章节 -->
			<chapterVue v-for="childChapter in chapters" 
				:from="chapter"
				:chapter="childChapter">
			</chapterVue>
		</template>
	</expendableContainerVue>
</template>

<script setup lang="ts" name="chapterVue"> 
import { ref } from "vue";
import articleVue from "./article.vue"
import chapterVue from "./chapter.vue"
import expendableContainerVue from "../expendableContainer.vue";
import { addArticle, createChapter, focusOnChapter,focusOnArticle, deleteChapter ,updateChapter} from "@/hooks/all-articles/allArticles";
import { showControlPanel } from "@/hooks/controlPanel";


	let {chapter,from} = defineProps(["chapter","from"])
	let expending = ref(true)

	let articles = ref(chapter.articles)
	let chapters = ref(chapter.chapters)

	const buttons = [{
		text:"插入章节",
		click:()=>{
			clickAddChapter()
		}
	},{
		text:"插入文本",
		click:()=>{
			clickAddArticle()
		}
	}]

	//点击插入章节
	async function clickAddChapter(){
		//弹出创建章节页面
		const newChapter = await createChapter(chapter)
		expending.value=true
		//聚焦到该章节
		focusOnChapter(newChapter)
	}

	//点击插入新文章
	async function clickAddArticle(){
		const newArticle = addArticle(chapter)
		//聚焦到该文章
		expending.value=true
		focusOnArticle(newArticle)
	}

	//长按显示控制面板
	function longtap(){
		showControlPanel([
			{
				text:"删除",
				click:()=>{
					deleteChapter(from,chapter)
				}
			},
			{
				text:"重命名",
				click:()=>{updateChapter(chapter)}
			}
		])
	}
</script>

<style lang="scss" scoped>
@use "@/static/style/leftPage.scss";
	.chapter{
		>:deep(.titleBar){
			@extend .leftPageMidTitleBar;
		}
	}
	.separator{
		@extend .leftPageSeparator
	}
</style>