<template>
	<div class="article" 
		@touchstart="touchStart" 
		@touchend="touchEnd"
		@mousedown="touchStart"
		@mouseup="touchEnd"> 
		<div class="title">{{title}}</div>
		<div v-show="ifPreview" class="preview">{{preview}}</div>
	</div>
</template>

<script setup lang="ts" name="article">
import { hidePage } from '@/hooks/pages/pageChange';
import { showArticleOnMain } from '@/hooks/pages/mainPage/showOnMain';
import { computed,ref } from 'vue';
import { LongTapAndClickTouchEnd, LongTapAndClickTouchStart } from '@/api/longTapAndClick';
import { showControlPanel } from '@/hooks/controlPanel';
import { deleteArticle } from '@/hooks/all-articles/allArticles';
import { translateToTextContent } from '@/hooks/expression/textAreaContent';
import { trim } from 'lodash';

	let {article,from} = defineProps(["article","from"])
	const title = computed(()=>{
		const tmp = trim(article.title)
		if(tmp == "" || !article.title){
			return "<未命名文本>"
		}
		else{
			return tmp
		}
	})
	//文章预览
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
	const ifLongTap = ref(false)
	let timeOut:any
	function touchStart(){
		timeOut = LongTapAndClickTouchStart(ifLongTap)
	}

	function touchEnd(){
		LongTapAndClickTouchEnd({
			theTimeOut:timeOut,
			ifLongTap,
			longTap:()=>{
				//显示控制面板
				showControlPanel([{
					text:"删除",
					click:()=>{
						deleteArticle(from,article)
					}
				}])
			},
			click:()=>{
				//点击将文章显示在主页面
				showArticleOnMain(article)
				hidePage("left")
			}
		})
	}
	
</script>

<style lang="scss" scoped>
	@use "@/static/style/leftPage.scss";
	.article{
		@extend .leftPageArticle;
	}
</style>