<template>
	<div class="exitence" @click="clickExitence">
		<div class="name">{{name}}</div>
		<div class="tags">
			<div v-for="(tag) in tags">[{{tag}}]</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="">
import { hidePage } from '@/hooks/pages/pageChange';
import { showExitenceOnMain } from '@/hooks/pages/mainPage/showOnMain';
import { computed } from 'vue'; 
import Status from '@/interfaces/exitenceStatus';
	let {exitence} = defineProps(["exitence"])
	const name = computed(()=>{
		return exitence.name
	})
	
	//显示事物的tag
	let tags = computed(()=>{
		const tagsStatus = exitence.status.find((status:Status)=>{
			if(status.__key == exitence.setting.tagStatus){
				return status
			}
		})
		return tagsStatus.value??[]
		
	})
	
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