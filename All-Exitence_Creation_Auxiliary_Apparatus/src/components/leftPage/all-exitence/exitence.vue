<template>
	<div class="exitence" @click="clickExitence">
		<div class="name">{{exitence.name}}</div>
		<div class="tags">
			<div v-for="(tag,index) in tags">[{{tag}}]</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="">
import { hidePage } from '@/hooks/pageChange';
import { showExitenceOnMain } from '@/hooks/mainPage/showOnMain';
import { ref } from 'vue'; 
	let {exitence} = defineProps(["exitence"])
	const tagsStatus = exitence.status.find((status:any)=>{
		return status.valueType == "tags"
	})
	//显示事物的tag
	let tags = ref([])
	if(tagsStatus){
		tags.value = tagsStatus.value??[]
	}
	//点击将事物显示在主页面
	function clickExitence(){
		showExitenceOnMain(exitence)
		hidePage("left")
	}
	
</script>

<style lang="scss" scoped>
	@use "@/static/style/leftPage.scss";
	.exitence{
		@extend .leftPageExitence
	}
</style>