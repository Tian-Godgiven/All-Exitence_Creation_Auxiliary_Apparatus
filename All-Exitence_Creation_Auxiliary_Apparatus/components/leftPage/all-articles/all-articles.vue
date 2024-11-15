<template>
	<view class="articles">
		<view v-for="(article,index) in articles">
			<articleVue :article="article"></articleVue>
			<view class="separator" v-if="index < articles.length-1"></view>
		</view>
		
		<chapterVue v-for="(chapter,index) in chapters" 
			:chapter="chapter"
		>
		</chapterVue>
	</view>
</template>

<script setup lang="ts" name=""> 
import chapterVue from './chapter.vue';
import articleVue from './article.vue';
import { ref } from 'vue';

import allArticlesJSON from "@/data/projects/项目1/all-articles.json"
// import { readFileToJSON } from '../../../hooks/dataFile';
	let chapters = ref([])
	let articles = ref([])

	const filePath = "/projects/项目1/all-articles.json"
	
	const loading = async ()=>{
		// let allArticles = readFileToJSON(filePath)
		let allArticles = allArticlesJSON
		if(allArticles){
			chapters = ref(allArticles.chapter)
			articles = ref(allArticles.articles)
		}
	}
	
	loading()
	
	
</script>

<style lang="scss" scoped>
	@import "@/static/style/leftPage.scss";
	.article{
		width: 100%;
	}
	.separator{
		@extend .leftPageSeparator;
	}
</style>