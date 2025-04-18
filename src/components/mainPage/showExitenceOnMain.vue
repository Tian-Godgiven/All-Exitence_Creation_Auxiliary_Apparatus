<template>
<TargetContainer title-align="left" ref="containerRef">
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
		<div class="exitenceAbility">
			<Button @click="switchControlMode" name="属性管理"></Button>
			<Button @click="setExitence" name="事物设置"></Button>
			<Button @click="addNewStatus" name="新增属性"></Button>
		</div>
	</template>
    <template #inner>
        <draggableListVue 
			ref="inner"
			:dragHandle="true"
			:showHandle="showDrag"
			v-slot="{element:status}"
			:list="exitenceStatus">
			<exitenceStatusVue 
				:key="status.__key"
				:status="status">
			</exitenceStatusVue>
		</draggableListVue>
		<div class="scrollSpace"></div>
    </template>
    <template #info>
        属性数: {{statusNum}}
    </template>
</TargetContainer>
</template>

<script setup lang="ts" name="">
	import { computed, onMounted, onUnmounted, provide, ref, useTemplateRef } from 'vue';
	import textAreaVue from '@/components/other/textArea/textArea.vue';
	import exitenceStatusVue from '@/components/all-exitence/exitence/exitenceStatus.vue';
	import { changeExitenceName, nowAllExitence } from '@/hooks/all-exitence/allExitence';
	import draggableListVue from '../other/draggableList/draggableList.vue';	
	import { Type } from '@/class/Type';
	import Status from '@/interfaces/Status';
	import Button from '../global/Button.vue';
	import { showPopUp } from '@/hooks/pages/popUp';
	import TargetContainer from './TargetContainer.vue';
import { showOnMain } from '@/hooks/pages/mainPage/showOnMain';

	let {exitence} = defineProps(["exitence"])

	const exitenceStatus = computed(()=>{
		return exitence.status
	})
	
	//事物所属的分类
	const type = nowAllExitence.types.find((type:Type)=>type.__key == exitence.typeKey)
	
	//显示事物的属性数量
	const statusNum = computed(()=>{
		return exitence.status.length
	}) 

	//改变名称
	function changeName(newName:string){
		changeExitenceName(exitence,newName)
	}

	//切换管理模式
	const showDrag = ref(false)
	function switchControlMode(){
		showDrag.value = !showDrag.value
	}
	

	//打开设置弹窗
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
	const ifNewStatus = ref(false)
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
		ifNewStatus.value = false
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
		display: flex;
	}
</style>