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
			<ExitenceStatus
				:key="status.__key"
				:status="status"/>
		</DraggableList>
		<div class="scrollSpace"></div>
    </template>
</TargetContainer>
</template>

<script setup lang="ts" name="">
	import { onMounted, onUnmounted, provide, ref, useTemplateRef } from 'vue';
	import textAreaVue from '@/components/other/textArea/textArea.vue';
	import ExitenceStatus from '@/components/all-exitence/exitence/ExitenceStatus.vue';
	import { changeExitenceName, getTypeByKey} from '@/hooks/all-exitence/allExitence';
	import DraggableList from '@/components/other/DraggableList.vue';
	import Status from '@/interfaces/Status';
	import { showPopUp } from '@/hooks/pages/popUp';
	import TargetContainer from './TargetContainer.vue';
	import { showOnMain } from '@/hooks/pages/mainPage/showOnMain';
	import { Exitence } from '@/class/Exitence';
	import Menu from '@/components/global/Menu.vue';
	import ListMenu from '@/components/global/ListMenu.vue';
	import Button from '@/components/global/Button.vue';

	const {exitence} = defineProps<{exitence:Exitence}>()
	
	//事物所属的分类
	const type = getTypeByKey(exitence.typeKey)
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
		click:()=>setExitence(),
	},{
		label:"新增属性",
		click:()=>addNewStatus()
	}]

	//切换管理模式
	const showDrag = ref(false)
	function switchControlMode(){
		showDrag.value = !showDrag.value
	}
	//点击打开设置弹窗
	function setExitence(){
		showPopUp({
			name:"事物设置",
			vueName:"setExitence",
			mask:true,
			buttons:[],
			props:{
				exitence:exitence,
				type:type
			},
			returnValue(newExitence){
				Object.assign(exitence,newExitence)
			}
		})
	}
	//创建新属性
	const containerRef = useTemplateRef("containerRef")
	function addNewStatus(){
		showPopUp({
			name:"新增属性",
			vueName:"createStatus",
			mask:true,
			buttons:[],
			props:{
				allStatus:exitence.status,
				allTypeStatus:type?.typeStatus
			},
			returnValue : addStatus,
			size:{
				width:"600px",
				height:"50%"
			},
		})
	}
	function addStatus(newStatus:Status){
		//将该属性添加到事物中
		exitence.status.push(newStatus)
		//滑动到最后
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

	provide("type",type)//提供该事物所在的分类
	provide("allStatus",exitence.status)//提供所有属性
	provide("allTypeStatus",type?.typeStatus)//提供所在的分类的所有属性

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