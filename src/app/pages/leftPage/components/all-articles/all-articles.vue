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
	import { nowAllArticles } from '@/hooks/all-articles/allArticles';
	import { computed, onMounted, onUnmounted } from 'vue';
	import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
	import { extractClosestEdge, type Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
	import { reorderWithEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge";
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

				// 获得拖动并放置了的元素
				const sourceData = source.data;
				const targetData = target.data;
				//找到来源的index
				const sourceType = sourceData.type as "chapter"|"article"
				//拖动对象
				const sourceObject = sourceData[sourceType] as Chapter|Article
				//目标对象
				let targetObject
				//拖动对象的来源
				const sourceFrom = source.data.from as any
				const sourceIndex = sourceFrom[sourceType+"s"].indexOf(sourceObject)
				let edge :Edge | null= null
				//目标是article类，获取其edge
				if(targetData.type == "article"){
					targetObject = targetData.chapter as Article
					edge = extractClosestEdge(targetData)
				}
				//目标是chapter类型
				else{
					targetObject = targetData.chapter as Chapter
					//获取instruction
					const instruction = extractInstruction(targetData)
					if(!instruction)return;
					//添加为子元素的情况:不再使用edge
					if(instruction.type == "make-child"){
						let theSourceObject 
						if(sourceType == "article"){
							//从原本的位置删除目标
							sourceFrom["articles"].splice(sourceIndex,1)
							theSourceObject = sourceObject as Article
							//将source放入target内部
							targetObject["articles"].push(theSourceObject)
						}
						else{
							sourceFrom["chapters"].splice(sourceIndex,1)
							theSourceObject = sourceObject as Chapter
							targetObject["chapters"].push(theSourceObject)
						}
						//设定source的from为targetObject
						sourceObject.from = [...targetObject.from]
						sourceObject.from.push(targetObject.__key)						
						//完成了，直接结束
						return;
					}
					//否则获取edge
					else if(instruction.type == "reorder-above"){
						edge = "top"
					}
					else if(instruction.type == "reorder-below"){
						edge = "bottom"
					}
					else{
						return;
					}
				}

				// 使用edge来改变位置
				// 先把source移动到和target一个层级,并改变目标文本或章节的from属性
				const targetFrom = targetData.from as any
				if(targetFrom != sourceFrom){
					sourceFrom[sourceType+"s"].splice(sourceIndex,1)
					targetFrom[sourceType+"s"].push(sourceObject)
					sourceObject["from"] = targetObject["from"]
				}

				//再获取二者此时在同一个from中的index
				const indexOfSource = targetFrom[sourceType+"s"].findIndex(
					(object:any) => object.__key === sourceData.__key
				);
				const indexOfTarget = targetFrom[sourceType+"s"].findIndex(
					(object:any) => object.__key === targetData.__key
				);

				if (indexOfTarget < 0 || indexOfSource < 0) {return}
				// 使用上述的边界来重新排列列表
				targetFrom[sourceType+"s"] = reorderWithEdge({
					list: targetFrom[sourceType+"s"], //需要被重排的列表
					startIndex: indexOfSource, //移动的元素的index
					indexOfTarget, //被放置的元素的index
					closestEdgeOfTarget:edge, //边界
					axis: "vertical", //排列方式
				});
				
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