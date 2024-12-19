<template>
	<div class="container">
		<div class="top">
			<downLineInputVue 
				v-model="typeName"
				class="typeName"
				placeholder="输入分类名称"/>
			<div class="button" @click="prepareStatus">预制属性</div>
		</div>

		<!-- 显示已有的属性 -->
		<div class="inner">
			<typeStatusVue 
				@deleteStatus="deleteStatus(index)" 
				v-for="(,index) in typeStatus" 
				:key="index"
				v-model:status="typeStatus[index]">
			</typeStatusVue>

			<!-- 创建新属性 -->
			<newTypeStatusVue 
				@createStatus="addStatus($event)">
			</newTypeStatusVue>

			<!-- 分类设置 -->
			<div class="setting">
				分类设置
			</div>
		</div>

		<!-- 确认按键 -->
		<div class="bottom">
			<div class="button" @click="confirm">确认</div>
			<div class="button" @click="closePopUp(popUp)">取消</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="">
import { provide, reactive, ref, toRaw } from 'vue'; 
import downLineInputVue from '@/components/other/input/downLineInput.vue';
import typeStatusVue from '@/components/popUps/all-exitence/type/typeStatus.vue';
import newTypeStatusVue from '@/components/popUps/all-exitence/type/newTypeStatus.vue';
import { closePopUp } from '@/hooks/popUp';
import { addType, checkTypeNameRepeat } from '@/hooks/all-exitence/allExitence';
import { showQuickInfo } from '@/api/showQuickInfo';

	const {popUp} = defineProps(["popUp","returnValue"])

	//分类名称
	let typeName = ref("")

	//分类的所有属性
	let typeStatus = reactive<any>([])
	provide("allStatus",typeStatus)
	provide("allTypeStatus",typeStatus)
	
	//显示预制属性弹窗
	function prepareStatus(){

	}
	//向分类中添加指定的属性，给予key标识符
	function addStatus(newStatus:{[key:string]:any}){
		let key:number
		if(typeStatus.length == 0){
			key = 0
		}
		else{
			key = typeStatus[typeStatus.length-1].__key + 1
		}
		//给予key标识符
		newStatus["__key"] = key
		typeStatus.push(newStatus)
	}
	//删除对应的属性
	function deleteStatus(index:number){
		typeStatus.splice(index,1)
	}

	// 分类设置
	const typeSetting = reactive([])


	//确认创建分类
	function confirm(){
		//分类名称不可为空
		if(typeName.value == "" || !typeName.value){
			showQuickInfo("分类名不可为空")
			return false
		}
		if(checkTypeNameRepeat(typeName.value)){
			showQuickInfo("分类名不可重复")
			return false
		}
		//添加该分类
		addType(typeName.value,toRaw(typeStatus),toRaw(typeSetting))
		//关闭弹窗
		closePopUp(popUp)
	}
</script>

<style lang="scss" scoped>
@use "@/static/style/components/inputs.scss";
@use "@/static/style/components/popUpButtons.scss";
	.container{
		height: 100%;
	}
	.top{
		display: flex;
		height: 100px;
		position: relative;
		.typeName{
			position: relative;
			top:-20px;
			margin-top:auto;
			font-size: 1.4rem;
			width: 550px;
			height: 60px;
		}
		.button{
			height: 80px;
			width: 80px;
			border: 3px solid black;
			margin: 10px
		}
	}
	.inner{
		width: 100%;
		overflow: auto;
		max-height: calc(100% - 200px);
	}
	.bottom{
		@extend .buttons;
	}
</style>