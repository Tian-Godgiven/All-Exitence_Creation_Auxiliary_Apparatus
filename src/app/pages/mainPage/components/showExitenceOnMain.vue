<template>
<TargetContainer title-align="left" ref="containerRef" :if-info="false">
    <template #title>
        <textAreaVue 
			@input="changeName"
			mode="string"
			placeholder="输入名称"
			v-model="exitence.name"
			:inputSupport="true">
		</textAreaVue>
    </template>
	<template #topBar>
		<Menu class="exitenceAbility" vertical="right" horizen="bottom">
			<template #default="{switchMenu}">
				<Button @click="switchMenu" icon="setting" ></Button>
			</template>
			<template #menu="{controlShow}">
				<ListMenu :controlShow :list="abilityList"/>
			</template>
		</Menu>
	</template>
    <template #inner>
        <DraggableList
			:dragHandle="true"
			:showHandle="showDrag"
			v-slot="{item:status}"
			:list="exitence.status">
			<ExitenceStatusVue
				:key="status.__key"
				:exitence
				:status
				:fullStatus="returnFullStatus(status).value"/>
		</DraggableList>
		<div class="scrollSpace"></div>
    </template>
</TargetContainer>
</template>

<script setup lang="ts" name="">
	import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
	import textAreaVue from '@/components/other/textArea/textArea.vue';
	import ExitenceStatusVue from '@/components/all-exitence/exitence/ExitenceStatus.vue';
	import { changeExitenceName, getTypeOfExitence, showSetExitencePopUp} from '@/hooks/all-exitence/allExitence';
	import DraggableList from '@/components/other/DraggableList.vue';
	import Status from '@/interfaces/Status';
	import TargetContainer from './TargetContainer.vue';
	import { showOnMain } from '@/hooks/pages/mainPage/showOnMain';
	import { Exitence, ExitenceStatus } from '@/class/Exitence';
	import Menu from '@/components/global/Menu.vue';
	import ListMenu from '@/components/global/ListMenu.vue';
	import Button from '@/components/global/Button.vue';
import { getFullStatusOfExitence, showCreateStatusPopUp } from '@/hooks/all-exitence/status';

	const {exitence} = defineProps<{exitence:Exitence}>()
	
	//事物所属的分类
	const type = getTypeOfExitence(exitence)
	//改变名称
	function changeName(newName:string){
		changeExitenceName(exitence,newName)
	}

	//功能菜单
	const abilityList = [{
		label:"属性管理",
		click:()=>switchControlMode()
	},{
		label:"事物设置",
		click:()=>showSetExitencePopUp(exitence,type),
	},{
		label:"新增属性",
		click:()=>addNewStatus()
	}]

	//获取对应的完整属性
	function returnFullStatus(status:ExitenceStatus){
		return getFullStatusOfExitence(type,status)
	} 

	//切换管理模式
	const showDrag = ref(false)
	function switchControlMode(){
		showDrag.value = !showDrag.value
	}
	
	//创建新属性
	const containerRef = useTemplateRef("containerRef")
	function addNewStatus(){
		showCreateStatusPopUp({
			popUpSet:{
				mask:true,
				size:{
					height:"50%"
				}
			},
			returnValue:addStatus
		})
	}
	function addStatus(newStatus:Status){
		//将该属性添加到事物中
		exitence.status.push(newStatus)
		containerRef.value?.setScrollTop("last")
	}

    // 记录文档滑动位置
    function getScrollTop(){
        //当前滑动位置
        if(containerRef.value){
            const scrollTop = containerRef.value.getScrollTop()
            if(scrollTop){
                showOnMain.scrollTop = scrollTop
                return;
            }
        }
        showOnMain.scrollTop = 0
        return 0
    }
    onMounted(()=>{
        //设定当前的滑动高度
        if(!containerRef.value)return;
		containerRef.value.setScrollTop(exitence.lastScrollTop)
        window.addEventListener("getShowOnMainScrollTop",getScrollTop)
    })
    onUnmounted(()=>{
        window.removeEventListener("getShowOnMainScrollTop",getScrollTop)
    })
</script>

<style lang="scss" scoped>
.scrollSpace{
	width: 100%;
	height: 30%;
}
.exitenceAbility{
	width: 60px;
	height: 60px;
	.button{
		border-radius: 10px;
		box-sizing: border-box;
		padding: 6px;
		width: 60px;
		height: 60px;
	}
}
</style>