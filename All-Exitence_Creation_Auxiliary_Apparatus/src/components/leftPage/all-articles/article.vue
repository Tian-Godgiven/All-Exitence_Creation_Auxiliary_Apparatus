<template>
	<div @click="clickArticle" class="article">
		<div class="title">{{title}}</div>
		<div v-show="ifPreview" class="preview">{{preview}}</div>
	</div>
</template>

<script setup lang="ts" name="article">
import { hidePage } from '@/hooks/pages/pageChange';
import { showArticle } from '@/hooks/pages/mainPage/showOnMain';
import { computed,ref } from 'vue';
	let {article} = defineProps(["article"])
	const title = computed(()=>{
		if(article.title == "" || !article.title){
			return "<未命名文本>"
		}
		else{
			return article.title
		}
	})
	let ifPreview = ref(false)
	const preview = computed(()=>{
		const slice = article.inner.slice(0,100)
		if(slice.length > 0){
			ifPreview.value = true
			return slice
		}
		else{
			ifPreview.value = false
			return ""
		}
	})
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