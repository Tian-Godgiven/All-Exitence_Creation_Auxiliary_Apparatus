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
import { nowAllArticles } from '@/hooks/all-articles/allArticles';

	let chapters = nowAllArticles.chapter
	let articles = nowAllArticles.article
	
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