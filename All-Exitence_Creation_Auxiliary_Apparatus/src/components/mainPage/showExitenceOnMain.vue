<template>
	<div class="container">
        <div class="top">
            <textAreaVue class="targetTitle"
				@blur="changeName"
				mode="string"
                placeholder="输入名称"
                v-model="exitence.name"
                :inputSupport="true">
            </textAreaVue>
			<div class="exitenceAbility">
				<div class="button" @click="setExitence">事物设置</div>
				<div class="button" @click="addNewStatus">新增属性</div>
			</div>
        </div>
        <div class="targetInner" ref="inner">
            <exitenceStatusVue 
				:key="Symbol()"
				v-for="(,index) in exitence.status" 
				:status="exitence.status[index]">
			</exitenceStatusVue>

			<div class="scrollSpace"></div>
        </div>
        <div class="targetInfo">属性数: {{statusNum}}</div>
    </div>
</template>

<script setup lang="ts" name="">
import { provide, ref } from 'vue';
import textAreaVue from '@/components/other/textArea/textArea.vue';
import exitenceStatusVue from '@/components/all-exitence/exitence/exitenceStatus.vue';
import { changeExitenceName, nowAllExitence } from '@/hooks/all-exitence/allExitence';	
import { Type } from '@/class/Type';
import Status from '@/interfaces/exitenceStatus';
import { showPopUp } from '@/hooks/pages/popUp';
	let {exitence} = defineProps(["exitence"])
	
	//事物所属的分类
	const type = nowAllExitence.types.find((type:Type)=>{
		if(type.__key == exitence.typeKey){
			return type
		}
    })
	
	//显示事物的属性数量
	const statusNum = exitence.status.length

	//改变名称
	function changeName(newName:string){
		changeExitenceName(exitence,newName)
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
			returnValue(newSetting){
				exitence.setting = newSetting
			}
		})
	}


	//创建新属性
	const ifNewStatus = ref(false)
	const inner = ref()//事物属性内容
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
		inner.value.scrollTop = inner.value.scrollHeight
	}

	provide("type",type)//提供该事物所在的分类
	provide("allStatus",exitence.status)//提供所有属性
	provide("allTypeStatus",type?.typeStatus)//提供所在的分类的所有属性

</script>

<style lang="scss" scoped>
	@use "@/static/style/mainPage.scss";
    .container{
        @extend .targetContainer;
		.targetTitle{
			text-align: left;
		}
		.targetInner{
			.scrollSpace{
				width: 100%;
				height: 30%;
			}
		}
    }
</style>