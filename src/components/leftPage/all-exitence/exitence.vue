<template>
<ObjectLine :buttonList :longTap :click :focusing :getData :canDrop class="exitence">
	<div class="inner">
		<div class="name">{{name}}</div>
		<div class="preview">{{ preview }}</div>
	</div>
	<template #dragShadow>
		<div class="dragShadow">{{ exitence.name }}</div>
	</template>
</ObjectLine>
</template>

<script setup lang="ts" name="">
import { hidePage } from '@/hooks/pages/pageChange';
import { showTargetOnMain } from '@/hooks/pages/mainPage/showOnMain';
import { computed } from 'vue'; 
import { showControlPanel } from '@/hooks/controlPanel';
import { deleteExitencePopUp, getExitenceStatusByKey } from '@/hooks/all-exitence/allExitence';
import { translateToTextContent } from '@/hooks/expression/textAreaContent';
import { Exitence } from '@/class/Exitence';
import ObjectLine from '../ObjectLine.vue';
import { focusOnLeftPage, getLeftPageFocusTarget } from '@/hooks/pages/leftPage';
import { Type } from '@/class/Type';
import { ElementDragPayload } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';

	let {type,exitence} = defineProps<{type:Type,exitence:Exitence}>()
	const name = computed(()=>{
		if(exitence.name.trim() == "" || !exitence.name){
			return `未命名${type.name}`
		}
		return exitence.name
	})
	//显示事物的预览内容：其对应的预览属性的值
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
	//聚焦
	const focusing = computed(()=>{
		return getLeftPageFocusTarget() == exitence.__key
	})

	const longTap = ()=>{
		//显示控制面板
		showControlPanel([{
			text:"删除",
			click:()=>{
				deleteExitencePopUp(type,exitence)
			}
		}])
	}
	//点击将事物显示在主页面并聚焦该对象
	const click = ()=>{
		showTargetOnMain({
			type:"exitence",
			target:exitence
		})
		focusOnLeftPage(exitence.__key,"all-exitence",false)
		hidePage("left")
	}

	//管理模式按钮
	const buttonList = [
		{name:"删除",click:()=>deleteExitencePopUp(type,exitence)}
	]

	//获取数据
	function getData(){
		return {
			type:"exitence",
			from:type,
			__key:exitence.__key
		}
	}

	const canDrop = (source:ElementDragPayload)=>{
		//source的来源必须一致
		if(source.data.from != type){
			return false
		}
		return source.data.type == "exitence"
	}
</script>

<style lang="scss" scoped>
.exitence{
	position: relative;
	width: 100%;
	.name{
		position: relative;
		font-size:$midFontSize;
		@include textMaxLine(2);//最多显示两行
	}
	.preview{
		font-size: $smallFontSize;
		color: $previewText;
		@include textMaxLine(3);//最多显示3行
	}
}
</style>