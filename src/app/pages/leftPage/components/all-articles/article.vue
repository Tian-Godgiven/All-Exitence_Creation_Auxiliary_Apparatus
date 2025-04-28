<template>
<ObjectLine :id="`article_${article.__key}`" :level :buttonList :longTap :click :focusing :getData :canDrop class="article">
	<div class="title">{{title}}</div>
	<div class="preview" v-show="ifPreview" >{{preview}}</div>
	<template #dragShadow>
		<div class="chapterShadow">{{ article.title }}</div>
	</template>
</ObjectLine>
</template>

<script setup lang="ts" name="article">
	import { hidePage } from '@/hooks/pages/pageChange';
	import { showTargetOnMain } from '@/hooks/pages/mainPage/showOnMain';
	import { computed,ref } from 'vue';
	import { showControlPanel } from '@/hooks/controlPanel';
	import { copyArticle, createArticle, deleteArticlePopUp } from '@/hooks/all-articles/allArticles';
	import { translateToTextContent } from '@/hooks/expression/textAreaContent';
	import { trim } from 'lodash';
	import { Article } from '@/class/Article';
	import { focusOnLeftPage, getLeftPageFocusTarget} from '@/hooks/pages/leftPage';
	import ObjectLine from '../ObjectLine.vue';
	import { ElementDragPayload } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';
import { Chapter } from '@/class/Chapter';

	let {article,from,level} = defineProps<{article:Article,from:{articles:Article[],chapters:Chapter[]},level:number}>()
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
	//聚焦到对象
	const focusing = computed(()=>{
		return article.__key == getLeftPageFocusTarget()
	})

	//长按和点击事件
	const longTap = ()=>{
		//显示控制面板
		showControlPanel({
			title:`文本：${article.title}`,
			option:[{
				text:"创建副本",
				click:()=>{
					const copy = copyArticle(article)
					//插入到当前文本下方
					insertTo(copy,1)
				}
			},{
				text:"删除",
				click:()=>{deleteArticlePopUp(from,article)}
			},{
				text:"插入新文本到上方",
				click:()=>{
					//创建文本
					const article = createArticle(from)
					//插入到上方
					insertTo(article,0)
				}
			},{
				text:"插入新文本到下方",
				click:()=>{
					//创建文本
					const article = createArticle(from)
					//插入到上方
					insertTo(article,1)
				}
			}]
		})
	}
	const click = ()=>{
		//点击将文章显示在主页面
		showTargetOnMain({
			type:"article",
			target:article
		})
		//聚焦
		focusOnLeftPage(article.__key,"all-article",false)
		hidePage("left")
	}
	//按钮
	const buttonList = [
		{name:"删除",click:()=>deleteArticlePopUp(from,article),icon:"delete"}
	]

	//插入某个对象到某个地方
	function insertTo(target:any,indexAdd:number,ifChapter:boolean=false){
		//插入到当前文本下方
		const index = from.articles.indexOf(article)
		if(ifChapter){
			from.chapters.splice(index+indexAdd,0,target)
		}
		else{
			from.articles.splice(index+indexAdd,0,target)
		}
	}

	//拖拽数据和控制
	function getData(){
		return {
			type:"article",
			article,
			from,
			__key:article.__key
		}
	}
	const canDrop = (source:ElementDragPayload)=>{
		return source.data.type == "article"
	}
	
</script>

<style lang="scss" scoped>
.article{
	position: relative;
	width: 100%;
	.title{
		font-size: $midFontSize;
		@include textMaxLine(2);//最多显示两行
	}
	.preview{
		width: 100%;
		color: $previewText;
		font-size: $smallFontSize;
		@include textMaxLine(3);//最多显示3行
	}
}
</style>