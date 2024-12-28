<template>
	<div class="exitence" 
		@touchstart="touchStart" 
		@touchend="touchEnd"
		@mousedown="touchStart"
		@mouseup="touchEnd">
		<div class="name">{{name}}</div>
		<div class="tags">
			<div v-for="(tag) in tags">[{{tag}}]</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="">
import { hidePage } from '@/hooks/pages/pageChange';
import { showExitenceOnMain } from '@/hooks/pages/mainPage/showOnMain';
import { computed, inject, ref } from 'vue'; 
import Status from '@/interfaces/exitenceStatus';
import { LongTapAndClickTouchEnd, LongTapAndClickTouchStart } from '@/api/longTapAndClick';
import { showControlPanel } from '@/hooks/controlPanel';
import { deleteExitence } from '@/hooks/all-exitence/allExitence';
	let {exitence} = defineProps(["exitence"])
	const name = computed(()=>{
		return exitence.name
	})

	const type:any = inject("type")

	const ifLongTap = ref(false)
	let timeOut:any
	function touchStart(){
		timeOut = LongTapAndClickTouchStart(ifLongTap)
	}

	function touchEnd(){
		LongTapAndClickTouchEnd({
			theTimeOut:timeOut,
			ifLongTap,
			longTap:()=>{
				//显示控制面板
				showControlPanel([{
					text:"删除",
					click:()=>{
						deleteExitence(type,exitence)
					}
				}])
			},
			click:()=>{
				//点击将事物显示在主页面
				showExitenceOnMain(exitence)
				hidePage("left")
			}
		})
	}
	
	//显示事物的tag
	let tags = computed(()=>{
		const tagsStatus = exitence.status.find((status:Status)=>{
			if(status.__key == exitence.setting.tagStatus){
				return status
			}
		})
		return tagsStatus.value??[]
		
	})
	
</script>

<style lang="scss" scoped>
	@use "@/static/style/leftPage.scss";
	.exitence{
		@extend .leftPageExitence
	}
</style>