<template>
	<div class="articles">
		<div v-for="(article,index) in articles">
			<articleVue :article="article"></articleVue>
			<div class="separator" v-if="index < articles.length-1"></div>
		</div>
		
		<chapterVue v-for="(chapter) in chapters" 
			:chapter="chapter">
		</chapterVue>
	</div>
</template>

<script setup lang="ts" name=""> 
import chapterVue from './chapter.vue';
import articleVue from './article.vue';
import { allArticle } from '@/hooks/all-articles/article';

	let chapters = allArticle.chapter
	let articles = allArticle.article
	
</script>

<style lang="scss" scoped>
	@use "@/static/style/leftPage.scss";
	.article{
		width: 100%;
	}
	.separator{
		@extend .leftPageSeparator;
	}
</style>