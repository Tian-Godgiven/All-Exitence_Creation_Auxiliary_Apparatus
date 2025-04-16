<template>
	<div class="article" ref="articleRef" 
		:class="[(dragState.type=='dragging' ? 'dragging':'')]"> 

		<div class="manageButtons" v-show="manageMode">
			<div class="button" @click="clickDeleteArticle($event)">删除</div>
			<div class="button" ref="handlerRef" @pointerdown.stop>拖动</div>
		</div>

		<longTapContainerVue :disabled="manageMode" @longtap="longtap" @click="click">
			<div class="title">{{title}}</div>
			<div v-show="ifPreview" class="preview">{{preview}}</div>
		</longTapContainerVue>

		<indicatorVue v-if="dragState.type === 'be-dragging-edge' 
			&& dragState.edge!=null" :edge="dragState.edge"
			gap="0px" />
	</div>
	

	<Teleport v-if="dragState.type=='preview'" :to="dragState.container">
		<div class="chapterShadow">{{ article.title }}</div>
	</Teleport>
</template>

<script setup lang="ts" name="article">
import { hidePage } from '@/hooks/pages/pageChange';
import { showArticleOnMain } from '@/hooks/pages/mainPage/showOnMain';
import { computed,ref,onMounted,onUnmounted, inject } from 'vue';
import { showControlPanel } from '@/hooks/controlPanel';
import { deleteArticlePopUp } from '@/hooks/all-articles/allArticles';
import { translateToTextContent } from '@/hooks/expression/textAreaContent';
import { trim } from 'lodash';
import longTapContainerVue from "../../other/longTapContainer.vue";
import { Article } from '@/class/Article';
import indicatorVue from '@/components/other/indicator.vue';
import { DragState, getCombine } from '@/api/dragToSort';

	let {article,from} = defineProps<{article:Article,from:any}>()
	const manageMode = inject("manageMode",false)
	//显示的标题
	const title = computed(()=>{
		const tmp = trim(article.title)
		if(tmp == "" || !article.title){
			return "<未命名文本>"
		}
		else{
			return tmp
		}
	})
	//显示的文章预览
	let ifPreview = ref(false)
	const preview = computed(()=>{
		//先翻译为文本内容
		const inner = translateToTextContent(article.inner)
		//截取一部分
		const slice = inner.slice(0,100)
		if(slice.length > 0){
			ifPreview.value = true
			return slice
		}
		else{
			ifPreview.value = false
			return ""
		}
	})
	//长按和点击事件
	const longtap = ()=>{
		//显示控制面板
		showControlPanel([{
			text:"删除",
			click:()=>{
				deleteArticlePopUp(from,article)
			}
		}])
	}
	const click = ()=>{
		//点击将文章显示在主页面
		showArticleOnMain(article)
		hidePage("left")
	}
	function clickDeleteArticle(event:Event){
		event.stopPropagation()
		deleteArticlePopUp(from,article)
	}

	//拖拽功能的实现
	const articleRef = ref<HTMLElement | null>(null)
	const handlerRef = ref<HTMLElement | null>(null)

	const idle:DragState = {type:"idle"}//初始拖拽状态
	const dragState = ref<DragState>(idle)//拖拽状态
	//获取数据
	function getArticleData(){
		return {
			type:"article",
			article,
			from,
			__key:article.__key
		}
	}

let cleanup = ()=>{}
onMounted(()=>{
	if(articleRef.value == null || handlerRef.value==null)return;
	cleanup = getCombine({
		element:articleRef.value,
		dragHandle:handlerRef.value,
		idle,
		dragState,
		getData:getArticleData,
		"canDrop":(source)=>{
			return source.data.type == "article"
		},
	})
})

onUnmounted(()=>{
	cleanup()
})
	

	
</script>

<style lang="scss" scoped>
	.article{
		position: relative;
		background-color: $bgColor;
		width: 100%;
		box-sizing: border-box;
		padding: 10px 20px; 
		.title{
			font-size: $midFontSize;
			@include textMaxLine(2);//最多显示两行
		}
		.preview{
			width: 100%;
			font-size: $smallFontSize;
			@include textMaxLine(3);//最多显示3行
		}
		.manageButtons{
			float: right;
			display: flex;
		}
	}
	.dragging{
		opacity: 0.5;
	}
</style>