<template>
	<div class="chapter">
		<div class="titleBar" @click="expending = !expending">
			<div class="titleName">{{ name }}</div>
		</div>
		<div class="inner" v-show="expending">
			<div v-for="(article,index) in articles">
				<articleVue :article = "article"></articleVue>
				<div class="separator" v-if="index < articles.length-1"></div>
			</div>
			
			<chapterVue v-for="(chapter,index) in chapters" 
				:chapter="chapter"
			>
			</chapterVue>
		</div>
	</div>
</template>

<script setup lang="ts" name="chapterVue"> 
import { ref } from "vue";
import articleVue from "./article.vue"
import chapterVue from "./chapter.vue"

	let {chapter:theChapter} = defineProps(["chapter"])
	let expending = ref(true)
	let name = ref(theChapter.name)
	let articles = ref(theChapter.article)
	let chapters = ref(theChapter.chapter)
</script>

<style lang="scss" scoped>
@use "@/static/style/leftPage.scss";
	.chapter{
		.titleBar{
			@extend .leftPageMidTitleBar;
		}
		
	}
	.separator{
		@extend .leftPageSeparator
	}
</style>