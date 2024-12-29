<template>
	<div class="all-articles">
		<div :key="Symbol()" v-for="(article,index) in articles">
			<articleVue 
				:from="nowAllArticles"
				:article="article"/>
			<div class="separator" v-if="index < articles.length-1"></div>
		</div>
		
		<chapterVue :key="Symbol()" v-for="(chapter) in chapters" 
			:from="nowAllArticles"
			:chapter="chapter">
		</chapterVue>
	</div>
</template>

<script setup lang="ts" name=""> 
import chapterVue from './chapter.vue';
import articleVue from './article.vue';
import { nowAllArticles } from '@/hooks/all-articles/allArticles';
import { computed } from 'vue';

	let chapters = computed(()=>{
		return nowAllArticles.chapters
	})
	let articles = computed(()=>{
		return nowAllArticles.articles
	})
	
</script>

<style lang="scss" scoped>
	@use "@/static/style/leftPage.scss";
	.all-article{
		width: 100%;
	}
	.separator{
		@extend .leftPageSeparator;
	}
</style>