<template>
	<div class="container">
        <div class="top">
            <textAreaVue class="targetTitle"
                placeholder="输入名称"
                v-model="exitence.name"
                :inputSupport="true">
            </textAreaVue>
			<div class="exitenceAbility">
				<div class="button" @click="addNewStatus">新增属性</div>
			</div>
        </div>
        <div class="targetInner" ref="inner">
            <exitenceStatusVue 
				v-for="(,index) in exitence.status" 
				:key='index'
				v-model:status="exitence.status[index]">
			</exitenceStatusVue>

			<div class="scrollSpace"></div>
        </div>
        <div class="targetInfo">属性数: {{statusNum}}</div>
    </div>
</template>

<script setup lang="ts" name="">
import { provide, ref } from 'vue';
import textAreaVue from '@/components/other/textArea/textArea.vue';
import exitenceStatusVue from '../popUps/all-exitence/exitence/exitenceStatus.vue';
import { types } from '@/hooks/all-exitence/allExitence';	
import { Type } from '@/class/Type';
import Status from '@/interfaces/exitenceStatus';
import { showPopUp } from '@/hooks/popUp';
	let exitence = defineModel<any>()
	
	//事物所属的分类
	const type = types.find((type:Type)=>{
		if(type.name == exitence.value.typeName){
			return type
		}
    })
	
	//显示事物的属性数量
	const statusNum = exitence.value.status.length
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
				allStatus:exitence.value.status,
				allTypeStatus:type.typeStatus
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
		exitence.value.status.push(newStatus)
		ifNewStatus.value = false
		//滑动到最后
		inner.value.scrollTop = inner.value.scrollHeight
	}

	provide("type",type)//提供该事物所在的分类
	provide("allStatus",exitence.value.status)//提供所有属性
	provide("allTypeStatus",type.typeStatus)//提供所在的分类的所有属性

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