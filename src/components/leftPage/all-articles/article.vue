<template>
<ObjectLine :level :buttonList :longTap :click :focusing :getData :canDrop class="article">
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
	import { deleteArticlePopUp } from '@/hooks/all-articles/allArticles';
	import { translateToTextContent } from '@/hooks/expression/textAreaContent';
	import { trim } from 'lodash';
	import { Article } from '@/class/Article';
	import { focusOnLeftPage, getLeftPageFocusTarget } from '@/hooks/pages/leftPage';
	import ObjectLine from '../ObjectLine.vue';
	import { ElementDragPayload } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';

	let {article,from,level} = defineProps<{article:Article,from:any,level:number}>()
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
		showControlPanel([{
			text:"删除",
			click:()=>{
				deleteArticlePopUp(from,article)
			}
		}])
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
		{name:"删除",click:()=>deleteArticlePopUp(from,article)}
	]

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