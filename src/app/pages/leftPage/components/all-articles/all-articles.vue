<template>
<div class="all-articles" id="leftPage-allArticles" ref="treeRef">
	<ProjectToolEntries />
	<chapterVue v-for="chapter in chapters" :key="chapter.__key" :level="0" :from="displayedTree" :chapter="chapter"/>
	<articleVue v-for="article in articles" :key="article.__key" :level="0" :from="displayedTree" :article="article"/>
	<Teleport to="body">
		<div v-if="dragOverlay" class="articleDragOverlay" :style="{left:`${dragOverlay.x}px`,top:`${dragOverlay.y}px`}">
			<span>{{ dragOverlay.label }}</span>
			<Icon icon="dragHandle"></Icon>
		</div>
	</Teleport>
</div>
</template>

<script setup lang="ts" name=""> 
	import chapterVue from './chapter.vue';
	import articleVue from './article.vue';
	import { moveArticleTreeItem, nowAllArticles, type From } from '@/hooks/all-articles/allArticles';
	import { computed, onMounted, onUnmounted, ref, toRaw, useTemplateRef } from 'vue';
	import { cloneDeep } from 'lodash';
	import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
	import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
	import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
	import { extractInstruction} from '@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item';
	import { type Chapter } from '@/class/Chapter';
	import { type Article } from '@/class/Article';
	import Icon from '@/components/global/Icon.vue';
	import ProjectToolEntries from './ProjectToolEntries.vue';

	const dragPreview = ref<typeof nowAllArticles|null>(null)
	const dragOverlay = ref<{label:string,x:number,y:number}|null>(null)
	let dragPlacementLock:{x:number,y:number}|null = null
	const treeRef = useTemplateRef("treeRef")
	const displayedTree = computed(()=>dragPreview.value ?? nowAllArticles)

	function findActualParent(path:string[]):From|null{
		let parent:From = nowAllArticles
		for(const key of path){
			const chapter:Chapter|undefined = parent.chapters.find(item=>item.__key === key)
			if(!chapter)return null
			parent = chapter
		}
		return parent
	}

	let chapters = computed(()=>displayedTree.value.chapters)
	let articles = computed(()=>displayedTree.value.articles)

	function updateDragPreview(source:any, location:any){
		const kind = source.data.type as "chapter"|"article"
		if(kind !== "chapter" && kind !== "article")return
		if(!dragPreview.value){
			dragPreview.value = cloneDeep(toRaw(nowAllArticles))
			dragPlacementLock = null
		}
		const input = location.current.input
		if(dragPlacementLock && Math.hypot(
			input.clientX - dragPlacementLock.x,
			input.clientY - dragPlacementLock.y,
		) < 8)return
		const candidates = location.current.dropTargets.filter((candidate:any)=>candidate.data.type !== kind || candidate.data.__key !== source.data.__key)
		const target = kind === "article"
			? candidates.find((candidate:any)=>candidate.data.type === "article") ?? candidates[0]
			: candidates[0]
		if(!target)return
		const targetData = target.data
		const previewItem = findPreviewItem(kind, source.data.__key)
		const previewSource = findPreviewParent(kind, source.data.__key)
		if(!previewItem || !previewSource)return

		let moved = false
		if(targetData.type === "article-tree-root"){
			const items = kind === "chapter" ? dragPreview.value.chapters : dragPreview.value.articles
			moved = moveArticleTreeItem(kind, previewItem, previewSource, dragPreview.value, kind === "article" ? 0 : items.length)
		} else if(targetData.type === "chapter"){
			const instruction = extractInstruction(targetData)
			if(!instruction)return
			const chapter = findPreviewItem("chapter", targetData.__key) as Chapter|null
			if(!chapter)return
			if(kind === "article"){
				moved = moveArticleTreeItem(kind, previewItem, previewSource, chapter, 0)
			} else if(instruction.type === "make-child"){
				const items = kind === "chapter" ? chapter.chapters : chapter.articles
				moved = moveArticleTreeItem(kind, previewItem, previewSource, chapter, items.length)
			} else if(instruction.type === "reorder-above" || instruction.type === "reorder-below"){
				const destination = findPreviewParent("chapter", targetData.__key)
				if(!destination)return
				if(kind === "chapter"){
					const index = destination.chapters.findIndex(item=>item.__key === targetData.__key)
					if(index >= 0)moved = moveArticleTreeItem(kind, previewItem, previewSource, destination, index + (instruction.type === "reorder-below" ? 1 : 0))
				}
			}
		} else if(targetData.type === "article" && kind === "article"){
			const destination = findPreviewParent("article", targetData.__key)
			const edge = extractClosestEdge(targetData)
			if(!destination || !edge)return
			const index = destination.articles.findIndex(item=>item.__key === targetData.__key)
			if(index >= 0)moved = moveArticleTreeItem(kind, previewItem, previewSource, destination, index + (edge === "bottom" ? 1 : 0))
		}
		if(moved)dragPlacementLock = {x:input.clientX,y:input.clientY}
	}

	function commitDragPreview(source:any){
		const kind = source.data.type as "chapter"|"article"
		const previewItem = findPreviewItem(kind, source.data.__key)
		if(!previewItem)return
		const destination = findActualParent(previewItem.from)
		const previewParent = findPreviewParent(kind, source.data.__key)
		const items = kind === "chapter" ? previewParent?.chapters : previewParent?.articles
		const index = items?.findIndex(item=>item.__key === source.data.__key)
		if(destination && index != null && index >= 0)moveArticleTreeItem(kind, source.data[kind], source.data.from, destination, index)
	}

	function findPreviewItem(kind:"chapter"|"article", key:string):Chapter|Article|null{
		function find(parent:From):Chapter|Article|null{
			const items = kind === "chapter" ? parent.chapters : parent.articles
			const item = items.find(candidate=>candidate.__key === key)
			if(item)return item as Chapter|Article
			for(const chapter of parent.chapters){ const nested = find(chapter); if(nested)return nested }
			return null
		}
		return dragPreview.value ? find(dragPreview.value) : null
	}

	function findPreviewParent(kind:"chapter"|"article", key:string):From|null{
		function find(parent:From):From|null{
			const items = kind === "chapter" ? parent.chapters : parent.articles
			if(items.some(item=>item.__key === key))return parent
			for(const chapter of parent.chapters){ const nested = find(chapter); if(nested)return nested }
			return null
		}
		return dragPreview.value ? find(dragPreview.value) : null
	}
 
	//拖动调整顺序功能
	let cleanup = ()=>{}
	let cleanupRootDropTarget = ()=>{}
	onMounted(()=>{
		cleanupRootDropTarget = treeRef.value ? dropTargetForElements({
			element:treeRef.value,
			canDrop:({source})=>source.data.type === "article" || source.data.type === "chapter",
			getData:()=>({type:"article-tree-root"}),
		}) : ()=>{}
		cleanup = monitorForElements({
			canMonitor({source}){
				const type = source.data.type
				if(type == "chapter" || type == "article"){
					return true;
				}
				return false
			},
			onDrag({source,location}){
				updateDragOverlay(source, location)
				updateDragPreview(source, location)
			},
			onDrop({source,location}){
				updateDragPreview(source, location)
				if(dragPreview.value){
					commitDragPreview(source)
					dragPreview.value = null
					dragOverlay.value = null
					dragPlacementLock = null
					return
				}
				// 获得当前的放置目标元素
				const target = location.current.dropTargets[0];
				if (!target) {
					dragOverlay.value = null
					return;
				}

				const sourceData = source.data;
				const targetData = target.data;
				const sourceType = sourceData.type as "chapter"|"article";
				const sourceObject = sourceData[sourceType] as Chapter|Article;
				const sourceFrom = sourceData.from as From;
				if(!sourceObject || !sourceFrom){
					dragOverlay.value = null
					return;
				}

				if(targetData.type === "chapter"){
					const instruction = extractInstruction(targetData);
					if(!instruction){ dragOverlay.value = null; return; }
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
				dragOverlay.value = null
			}	
		})
	})
	function updateDragOverlay(source:any, location:any){
		const input = location.current.input
		const item = source.data[source.data.type] as Chapter|Article|undefined
		if(!item || !input)return
		dragOverlay.value = {
			label: source.data.type === "chapter" ? (item as Chapter).name : (item as Article).title,
			x: input.clientX + 14,
			y: input.clientY + 10,
		}
	}
	onUnmounted(()=>{
		cleanup()
		cleanupRootDropTarget()
	})
	
</script>

<style lang="scss" scoped>
	.all-articles{
		position: relative;
		width: 100%;
	}
	.articleDragOverlay{
		position: fixed;
		z-index: 10000;
		pointer-events: none;
		display: flex;
		align-items: center;
		gap: 6px;
		max-width: 260px;
		padding: 5px 8px;
		background: $bgColor;
		border: 1px solid $bgColor70;
		box-shadow: $menuShadow;
		span{ overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
		.icon{ width: 18px; height: 18px; flex: 0 0 auto; }
	}
</style>
