<template>
	<div class="exitence" 
		@touchstart="touchStart" 
		@touchend="touchEnd"
		@mousedown="touchStart"
		@mouseup="touchEnd">
		<div class="name">{{name}}</div>
		<div class="preview">
			<div>{{ preview }}</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="">
import { hidePage } from '@/hooks/pages/pageChange';
import { showExitenceOnMain } from '@/hooks/pages/mainPage/showOnMain';
import { computed, inject, ref } from 'vue'; 
import { LongTapAndClickTouchEnd, LongTapAndClickTouchStart } from '@/api/longTapAndClick';
import { showControlPanel } from '@/hooks/controlPanel';
import { deleteExitencePopUp, getExitenceStatusByKey } from '@/hooks/all-exitence/allExitence';
import { translateToTextContent } from '@/hooks/expression/textAreaContent';
	let {exitence} = defineProps(["exitence"])
	const name = computed(()=>{
		if(exitence.name.trim() == "" || !exitence.name){
			return `未命名${type.name}`
		}
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
						deleteExitencePopUp(type,exitence)
					}
				}])
			},
			click:()=>{
				//点击将事物显示在主页面
				showExitenceOnMain(type,exitence)
				hidePage("left")
			}
		})
	}
	
	//显示事物的预览属性的内容
	let preview = computed(()=>{
		const key = exitence.setting?.previewStatus
		if(!key){return ""}
		const status = getExitenceStatusByKey(key,exitence.status,type.typeStatus)
		if(!status){return ""}
		if(status.valueType == "tags"){
			let tmp = ""
			for(let tag of status.value){
				tmp += `[${translateToTextContent(tag)}] `
			}
			return tmp
		}
		const tmp = translateToTextContent(status.value)
		return tmp.slice(0,100)
	})
	
</script>

<style lang="scss" scoped>
	@use "@/static/style/leftPage.scss";
	.exitence{
		@extend .leftPageExitence
	}
</style>