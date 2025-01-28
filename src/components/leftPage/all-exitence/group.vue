<template>
	<div class="group">
		<div class="titleBar" ref="groupRef" 
			:class="[(dragState.type=='dragging' ? 'dragging':'')]">
			<div class="titleButtons" v-show="!manageMode">
				<div class="button" @click="updateGroupPopUp(type,group)">编辑</div>
			</div>

			<div class="titleButtons manageButtons" v-show="manageMode">
				<div @click="deleteGroup(type,group)">删除</div>
				<div ref="handlerRef">拖动</div>
			</div>
			
			<longTapContainerVue class="titleName" @longtap = "longtap" @click="swicthExpending()">
				<div class="text">{{ group.name }}</div>
			</longTapContainerVue>
		</div>

		<div class="inner" v-show="expending">
			<div v-show="!manageMode" v-for="(exitence,index) in groupExitence">
				<exitenceVue :exitence="exitence"/>
				<div class="separator" v-if="index < groupExitence.length-1"></div>
			</div>
		</div>

		<indicatorVue v-if="dragState.type === 'be-dragging-edge' 
			&& dragState.edge!=null" :edge="dragState.edge"
			gap="0px" />
	</div>

	<Teleport v-if="dragState.type=='preview'" :to="dragState.container">
		<div class="shadow">{{ type.name }}</div>
	</Teleport>
</template>

<script setup lang="ts" name=""> 
import { inject,computed,ref, onMounted, onUnmounted } from 'vue';
import exitenceVue from './exitence.vue';
import { deleteGroup, updateGroupPopUp } from '@/hooks/all-exitence/allExitence';
import { showControlPanel } from '@/hooks/controlPanel';
import { Group } from '@/class/Group';
import { Exitence } from '@/class/Exitence';
import longTapContainerVue from "../../other/longTapContainer.vue";
import { DragState } from "@/interfaces/dragState";
import indicatorVue from '@/components/other/indicator.vue';
import { getCombine } from "@/api/dragToSort";
	
	let {group,groupExitence} = defineProps<{group:Group,groupExitence:Exitence[]}>() 
	const type = inject<any>("type")
	const manageMode = inject("manageMode",false)
	//切换展开
	const expending = computed(()=>{
		return group.expending
	})
	function swicthExpending(){
		group.expending = !expending.value
	}
	// 长按显示控制面板
	function longtap(){
		showControlPanel([
			{
				text:"编辑分组",
				click:()=>{
					updateGroupPopUp(type,group)
				}
			},
			{
				text:"删除分组",
				click:()=>{
					deleteGroup(type,group)
				}
			}
		])
	}

	//拖动功能的实现
	const groupRef = ref<HTMLElement | null>(null)
	const handlerRef = ref<HTMLElement | null>(null)

	const idle:DragState = {type:"idle"}//初始拖拽状态
	const dragState = ref<DragState>(idle)//拖拽状态
	//获取数据
	function getGroupData(){
		return {
			type:"group",
			from:type,
			__key:group.__key
		}
	}

let cleanup = ()=>{}
onMounted(()=>{
	if(groupRef.value == null || handlerRef.value==null)return;
	cleanup = getCombine({
		element:groupRef.value,
		dragHandle:handlerRef.value,
		idle,
		dragState,
		getData:getGroupData,
		"canDrop":(source)=>{
			//source的来源必须和该group一致
			if(source.data.from != type){
				return false
			}
			return source.data.type == "group"
		},
	})
})

onUnmounted(()=>{
	cleanup()
})

</script>

<style lang="scss" scoped>
@use "@/static/style/leftPage.scss";
@use "@/static/style/global.scss" as global;
	.group{
		position: relative;
		border: global.$antiBgColor 5px solid;
		.titleBar{
			@extend .leftPageGroup;
		}
	}
	.separator{
		@extend .leftPageSeparator;
	}
</style>