<template>
	<div class="chapter">
		<div
			@mousedown="touchStart"
			@mouseup="touchEnd" class="titleBar" >
			<div class="titleButtons">
				<div class="button" @click="clickAddChapter">插入章节</div>
				<div class="button" @click="clickAddArticle">插入文本</div>
			</div>
			<div class="titleName">{{ chapter.name }}</div>
		</div>
		<div class="inner" v-show="expending">
			<!-- 章节内的文本 -->
			<div v-for="(article,index) in articles">
				<articleVue :article = "article"></articleVue>
				<div class="separator" v-if="index < articles.length-1"></div>
			</div>
			<!-- 章节内的章节 -->
			<chapterVue v-for="childChapter in chapters" 
				:from="chapter"
				:chapter="childChapter">
			</chapterVue>
		</div>
	</div>
</template>

<script setup lang="ts" name="chapterVue"> 
import { ref } from "vue";
import articleVue from "./article.vue"
import chapterVue from "./chapter.vue"
import { addArticle, createChapter, focusOnChapter,focusOnArticle, deleteChapter ,updateChapter} from "@/hooks/all-articles/allArticles";
import { showControlPanel } from "@/hooks/controlPanel";
import { LongTapAndClickTouchEnd, LongTapAndClickTouchStart } from "@/api/longTapAndClick";

	let {chapter,from} = defineProps(["chapter","from"])
	let expending = ref(true)

	let articles = ref(chapter.articles)
	let chapters = ref(chapter.chapters)
	const ifLongTap = ref(false)
	let timeout:any 
	//处理点击和长按事件
	function touchStart(){
		timeout = LongTapAndClickTouchStart(ifLongTap)
	}
	function touchEnd(){
		LongTapAndClickTouchEnd({
			theTimeOut:timeout,
			ifLongTap,
			longTap:()=>longtap(),
			click:()=>clickTitle()
		})
	}
	
	//点击收起/展开章节
	function clickTitle(){
		expending.value = !expending.value
	}

	//点击插入章节
	async function clickAddChapter(event:Event){
		event.stopPropagation();
		//弹出创建章节页面
		const newChapter = await createChapter(chapter)
		expending.value=true
		//聚焦到该章节
		focusOnChapter(newChapter)
	}

	//点击插入新文章
	async function clickAddArticle(event:Event){
		event.stopPropagation()
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
		.titleBar{
			@extend .leftPageMidTitleBar;
		}
		
	}
	.separator{
		@extend .leftPageSeparator
	}
</style>