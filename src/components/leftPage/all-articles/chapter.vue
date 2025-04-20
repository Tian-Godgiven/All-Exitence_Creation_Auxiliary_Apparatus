<template>
<ContainerLine 
	:click :longTap :getData :buttonList :expending :allowInto="true" :canDrop
	:level
	class="chapter">
	<div class="empty"></div>
	<template #title>
		<div class="title">
			{{chapter.name }}
		</div>
	</template>
	<template #inner>
		<div class="inner">
			<chapterVue v-for="childChapter in chapters" 
				:key="chapter.__key"
				:level="level+1"
				:from="chapter"
				:chapter="childChapter">
			</chapterVue>
			<div class="articles" v-for="(article,index) in articles">
				<articleVue 
					:level="level+1"
					:key="article.__key"
					:from="chapter" 
					:article = "article">
				</articleVue>
				<Separator v-if="index < articles.length-1"></Separator>
			</div>
		</div>
	</template>
	<template #dragShadow>
		<div class="chapterShadow">{{ chapter.name }}</div>
	</template>
</ContainerLine>
</template>

<script setup lang="ts" name="chapterVue"> 
	import { computed } from "vue";
	import articleVue from "./article.vue"
	import chapterVue from "./chapter.vue"
	import { addArticle, addChapterPopUp, focusOnChapter,focusOnArticle, deleteChapterPopUp ,updateChapter} from "@/hooks/all-articles/allArticles";
	import { showControlPanel } from "@/hooks/controlPanel";
	import { Chapter } from "@/class/Chapter";
	import ContainerLine from "../ContainerLine.vue";
	import { ElementDragPayload } from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";
	import Separator from "../Separator.vue";

	let {chapter,from,level} = defineProps<{chapter:Chapter,from:{chapters:Chapter[]},level:number}>()
	//展开与切换展开
	let expending = computed(()=>{
		return chapter.expending
	})
	//点击切换展开
	const click = ()=>{
		chapter.expending = !expending.value
	}
	//长按显示控制面板
	const longTap = ()=>{
		showControlPanel([{
			text:"删除",
			click:()=>{deleteChapterPopUp(from,chapter)}
		},{
			text:"重命名",
			click:()=>{updateChapter(chapter)}
		}])
	}
	//拖拽数据
	function getData(){
		return {
			type:"chapter",
			chapter,
			from,
			__key:chapter.__key
		}
	}

	//显示的内容
	let articles = computed(()=>{
		return chapter.articles
	})
	let chapters = computed(()=>{
		return chapter.chapters
	})

	//点击插入章节
	const clickAddChapter = async()=>{
		//弹出创建章节页面
		const newChapter = await addChapterPopUp(chapter)
		chapter.expending=true
		//聚焦到该章节
		focusOnChapter(newChapter)
	}
	//点击插入新文章
	const clickAddArticle = async()=>{
		const newArticle = addArticle(chapter)
		//聚焦到该文章
		chapter.expending=true
		focusOnArticle(newArticle)
	}

	//按键列表
	const buttonList = {
		unmanage:[
			{name:"插入章节",click:()=>clickAddChapter(),icon:undefined},
			{name:"插入文章",click:()=>clickAddArticle(),icon:undefined}
		],
		manage:[
			{name:"删除",click:()=>deleteChapterPopUp(from,chapter)}
		]
	}
	const canDrop = (source:ElementDragPayload)=>{
		const type = source.data.type
		//要求必须放置在chapter或文章上
		if(type == "chapter" || type == "article"){
			return true
		}
		return false
	}     

</script>

<style lang="scss" scoped>
.chapter{
	position: relative;
	:deep(>.top){
		background-color: $bgColor80;
		height: 70px;
	}
	.title{
		line-height: 70px;
		width: 100%;
		font-size: $midFontSize;
		@include textMaxLine(1);
	}
}
.chapterShadow{
	background-color: white;
	width: 100px;
	height: 50px;
	border: 3px solid black;
}
</style>