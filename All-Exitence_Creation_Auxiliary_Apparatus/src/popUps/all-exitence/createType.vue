<template>
	<div>
		<div class="top">
			<downLineInputVue 
				class="typeName"
				placeholder="输入分类名称"/>
			<div class="button" @click="extendStatus">继承属性</div>
		</div>
		<!-- 分类属性 -->
		<div class="inner">
			<!-- 显示已有的属性 -->
			<typeStatusVue 
				@deleteStatus="deleteStatus(index)" 
				v-for="(status,index) in typeStatus" 
				:key="index"
				v-model="typeStatus[index]">
			</typeStatusVue>
			<!-- 创建新属性 -->
			<newTypeStatusVue @createStatus="addStatus($event)"></newTypeStatusVue>
		</div>
		<!-- 分类设置 -->
		<div class="setting">
			分类设置
		</div>
	</div>
</template>

<script setup lang="ts" name="">
import { provide, ref } from 'vue'; 
import downLineInputVue from '@/components/other/input/downLineInput.vue';
import typeStatusVue from '@/components/popUps/all-exitence/type/typeStatus.vue';
import newTypeStatusVue from '@/components/popUps/all-exitence/type/newTypeStatus.vue';

	let typeStatus = ref<any>([])
	provide("typeStatus",typeStatus)
	
	//添加指定的属性，给予key标识符
	function addStatus(newStatus:{[key:string]:any}){
		let key:number
		if(typeStatus.value.length == 0){
			key = 0
		}
		else{
			key = typeStatus.value[typeStatus.value.length-1].__key + 1
		}
		//给予key标识符
		newStatus["__key"] = key
		typeStatus.value.push(newStatus)
	}
	
	function extendStatus(){
		
	}
	
	//删除对应的属性
	function deleteStatus(index:number){
		typeStatus.value.splice(index,1)
	}
</script>

<style lang="scss" scoped>
@use "@/static/style/components/inputs.scss";
	.top{
		display: flex;
		height: 100%;
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
		
	}
</style>