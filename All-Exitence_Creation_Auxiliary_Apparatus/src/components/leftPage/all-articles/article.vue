<template>
	<div @click="clickArticle" class="article">
		<div class="title">{{article.title}}</div>
		<div class="preview">{{article.inner.slice(0,100)}}</div>
	</div>
</template>

<script setup lang="ts" name="article">
import { hidePage } from '@/hooks/pageChange';
import { showArticle } from '@/hooks/mainPage/showOnMain';
	let {article} = defineProps(["article"])
	
	//点击切换到该文章
	function clickArticle(){
		showArticle(article)
		hidePage("left")
	}
	
</script>

<style lang="scss" scoped>
	@use "@/static/style/leftPage.scss";
	.article{
		@extend .leftPageArticle;
	}
</style>