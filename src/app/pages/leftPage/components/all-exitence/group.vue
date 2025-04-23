<template>
<ContainerLine :buttonList :click :longTap :expending :getData :canDrop class="group">
	<template #title>
		<div class="title">{{ group.name }}</div>
	</template>
	<template #inner>
		<div v-show="!nowLeftManage">
			<exitenceVue 
				v-for="(exitence) in groupExitence" ]
				:key="exitence.__key" 
				:type 
				:exitence/>
		</div>
	</template>
	<template #dragShadow>
		<div class="shadow">{{ group.name }}</div>
	</template>
</ContainerLine>
</template>

<script setup lang="ts" name=""> 
import { computed } from 'vue';
import exitenceVue from './exitence.vue';
import { deleteGroup, updateGroupPopUp } from '@/hooks/all-exitence/allExitence';
import { showControlPanel } from '@/hooks/controlPanel';
import { Group } from '@/class/Group';
import { Exitence } from '@/class/Exitence';
import { Type } from '@/class/Type';
import { nowLeftManage } from '@/hooks/pages/leftPage';
import ContainerLine from '../ContainerLine.vue';
import { ElementDragPayload } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';

	let {group,groupExitence,type} = defineProps<{group:Group,groupExitence:Exitence[],type:Type}>() 

	//切换展开
	const expending = computed(()=>{
		return group.expending
	})
	const click = ()=>{
		group.expending = !expending.value
	}
	// 长按显示控制面板
	const longTap = ()=>{
		showControlPanel([{
			text:"编辑分组",
			click:()=>{
				updateGroupPopUp(type,group)
			}
		},{
			text:"删除分组",
			click:()=>{
				deleteGroup(type,group)
			}
		}])
	}

	//按键列表
	const buttonList = {
		unmanage:[
			{name:"编辑",click:()=>updateGroupPopUp(type,group),icon:"edit"},
		],
		manage:[
			{name:"删除",click:()=>deleteGroup(type,group),icon:"delete"}
		]
	}
	
	//获取数据
	function getData(){
		return {
			type:"group",
			from:type,
			__key:group.__key
		}
	}
	const canDrop = (source:ElementDragPayload)=>{
		//source的来源必须和该group一致,即都是type
		if(source.data.from != type){
			return false
		}
		//并且只能在分组之间相互移动
		return source.data.type == "group"
	}

</script>

<style lang="scss" scoped>
.group{
	position: relative;
	border: $antiBgColor 5px solid;
	:deep(.top){
		background-color: $bgColor;
		height: 60px;
	}
	.title{
		line-height: 60px;
		width: 100%;
		height: 55px;
		font-style: italic;
		font-size: $fontSize1;
		@include textMaxLine(1);
	}
}

</style>