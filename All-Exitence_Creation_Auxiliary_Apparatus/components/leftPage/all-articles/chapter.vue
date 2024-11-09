<template>
	<view class="chapter">
		<view class="titleBar" @click="expending = !expending">
			<view class="titleName">{{ name }}</view>
		</view>
		<view class="inner" v-show="expending">
			<view v-for="(article,index) in articles">
				<articleVue :article = "article"></articleVue>
				<view class="separator" v-if="index < articles.length-1"></view>
			</view>
			
			<chapterVue v-for="(chapter,index) in chapters" 
				:chapter="chapter"
			>
			</chapterVue>
		</view>
	</view>
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
@import "@/static/style/leftPage.scss";
	.chapter{
		.titleBar{
			@extend .leftPageMidTitleBar;
		}
		
	}
	.separator{
		@extend .leftPageSeparator
	}
</style>