<template>
	<view class="article">
		<view class="title">{{articleTitle}}</view>
		<view class="preview">{{articlePreview}}</view>
	</view>
</template>

<script setup lang="ts" name="article">
import { ref } from 'vue'; 
	let {article} = defineProps(["article"])
	
	let 文章标题 = article.title
	let 文章内容 = article.inner
	// 生成文章预览，提取前100个字符
	let 预览内容 = 文章内容.slice(0,100)

	let articleTitle = ref(文章标题)
	let articlePreview = ref(预览内容)
	
	
</script>

<style lang="scss" scoped>
	@import "@/static/style/leftPage.scss";
	.article{
		@extend .leftPageArticle;
	}
</style>