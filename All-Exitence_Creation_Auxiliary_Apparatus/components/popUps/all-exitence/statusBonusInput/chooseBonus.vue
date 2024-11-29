<template>
	<!-- 选项栏 -->
	<view class="choose">
		<view class="chooseNum">
			<view class="halfInput">最少选择:<input @blur="setChooseNum" v-model.number="chooseMin"/></view>
			<view class="halfInput">最多选择:<input @blur="setChooseNum" v-model.number="chooseMax"/></view>
		</view>
		<!-- 已有选项 -->
		<view class="choices">
			<view class="choice" v-for="(choice,index) in choices">
				<view class="text">{{choice}}</view>
				<view class="button" @click="deleteChoice(index)">删除</view>
			</view>
		</view>
		
		<!-- 新增选项输入 -->
		<view class="newChoice">
			<input v-model="newChoice" placeholder="新增选项"/>
			<view class="button" @click="addChoice">新增</view>
		</view>
	</view>

</template>

<script setup lang="ts" name="">
import { inject, reactive, ref, toRaw, watch } from 'vue'; 
import { showQuickInfo } from '@/api/showQuickInfo';
	const status = inject('status');
// 选择数量输入栏
	let chooseMin = ref(0)
	let chooseMax = ref(0)
	// 最少选择数量不小于0
	watch(chooseMin,()=>{
		if(chooseMin.value < 0){
			chooseMin.value = 0
		}
	})
	const setChooseNum = ()=>{
		status['setting']['chooseNum'] = [chooseMin.value,chooseMax.value]
	}
	setChooseNum()
	// 选项
	let choices = reactive([])
	let newChoice = ref()
	// 添加选项
	function addChoice(){
		//选项内容不能重复
		if(choices.includes(newChoice.value)){
			showQuickInfo("选项内容不得重复")
			return false
		}
		const tmp = newChoice.value
		newChoice.value = "" //清空
		if(!tmp || tmp == ""){
			showQuickInfo("选项不能为空")
			return false
		}
		const choice = tmp
		choices.push(choice)
		status["setting"]["choices"] = toRaw(choices)
		// 初始化最大选择数量
		if(chooseMax.value == 0){
			chooseMax.value = 1
			setChooseNum()
		}
	}
	// 删除选项
	function deleteChoice(index:number){
		
		//如果选项在value中，则删除
		const choice = choices[index]
		const tmp = toRaw(status["value"])
		if(!tmp){
			return false
		}
		const findIndex = tmp.indexOf(choice)
		
		if(findIndex!=-1){
			tmp.splice(findIndex,1)
			status["value"] = tmp
		}
		choices.splice(index,1)
		status["setting"]["choices"] = toRaw(choices)
	}

</script>

<style lang="scss" scoped>
@import "@/static/style/components/inputs.scss";

	.choose{
		.chooseNum{
			display: flex;
		}
		.choices{
			display: flex;
			.choice{
				display: flex;
				.button{
					
				}
			}
		}
		
		.newChoice{
			display: flex;
		}
	}
	.halfInput{
		@extend .halfInput;
	}
</style>