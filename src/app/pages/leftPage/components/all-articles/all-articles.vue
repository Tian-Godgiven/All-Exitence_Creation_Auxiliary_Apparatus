<template>
<div class="all-articles" id="leftPage-allArticles">
	<chapterVue v-for="(chapter) in chapters" 
		:key="chapter.__key"
		:level="0"
		:from="nowAllArticles"
		:chapter="chapter"/>
	<articleVue 
		:key="article.__key" v-for="(article) in articles"
		:level="0"
		:from="nowAllArticles"
		:article="article"/>
</div>
</template>

<script setup lang="ts" name=""> 
	import chapterVue from './chapter.vue';
	import articleVue from './article.vue';
	import { moveArticleTreeItem, nowAllArticles, type From } from '@/hooks/all-articles/allArticles';
	import { computed, onMounted, onUnmounted } from 'vue';
	import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
	import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
	import { extractInstruction} from '@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item';
	import { type Chapter } from '@/class/Chapter';
	import { type Article } from '@/class/Article';

	let chapters = computed(()=>{
		return nowAllArticles.chapters
	})
	let articles = computed(()=>{
		return nowAllArticles.articles
	})
 
	//拖动调整顺序功能
	let cleanup = ()=>{}
	onMounted(()=>{
		cleanup = monitorForElements({
			canMonitor({source}){
				const type = source.data.type
				if(type == "chapter" || type == "article"){
					return true;
				}
				return false
			},
			onDrop({source,location}){
				// 获得当前的放置目标元素
				const target = location.current.dropTargets[0];
				if (!target) {
					return;
				}

				const sourceData = source.data;
				const targetData = target.data;
				const sourceType = sourceData.type as "chapter"|"article";
				const sourceObject = sourceData[sourceType] as Chapter|Article;
				const sourceFrom = sourceData.from as From;
				if(!sourceObject || !sourceFrom)return;

				if(targetData.type === "chapter"){
					const instruction = extractInstruction(targetData);
					if(!instruction)return;
					if(instruction.type === "make-child"){
						const chapter = targetData.chapter as Chapter;
						if(!chapter)return;
						const items = sourceType === "article" ? chapter.articles : chapter.chapters;
						moveArticleTreeItem(sourceType,sourceObject,sourceFrom,chapter,items.length);
						return;
					}
					if(targetData.type !== sourceType)return;
					if(instruction.type !== "reorder-above" && instruction.type !== "reorder-below")return;
					const destination = targetData.from as From;
					if(!destination)return;
					const index = destination.chapters.findIndex(item=>item.__key === targetData.__key);
					if(index < 0)return;
					moveArticleTreeItem(sourceType,sourceObject,sourceFrom,destination,index+(instruction.type === "reorder-below" ? 1 : 0));
				} else if(targetData.type === "article" && sourceType === "article"){
					const destination = targetData.from as From;
					const edge = extractClosestEdge(targetData);
					if(!destination || !edge)return;
					const index = destination.articles.findIndex(item=>item.__key === targetData.__key);
					if(index < 0)return;
					moveArticleTreeItem(sourceType,sourceObject,sourceFrom,destination,index+(edge === "bottom" ? 1 : 0));
				}
				
			}	
		})
	})
	onUnmounted(()=>{
		cleanup()
	})
	
</script>

<style lang="scss" scoped>
	.all-articles{
		position: relative;
		width: 100%;
	}
</style>
