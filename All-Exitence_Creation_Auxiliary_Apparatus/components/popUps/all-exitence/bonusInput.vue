<template>
	<view>
		<!-- 范围输入栏 -->
		<view class="range" v-if="status['valueType'] == 'range'">
			<view class="top">
				<view class="halfInput">下限值:<input v-model.number="rangeMin" type="number"/></view>
				<view class="halfInput">上限值:<input v-model.number="rangeMax" type="number"/></view>
			</view>
			<view class="halfInput" >单位值:<input v-model.number="rangeStep" type="number"/></view>
		</view>
		<!-- 选项栏 -->
		<view class="choose" v-if="status['valueType'] == 'choose'">
			<view class="chooseNum">
				<view class="halfInput">最少选择:<input v-model.number="chooseMin"/></view>
				<view class="halfInput">最多选择:<input v-model.number="chooseMax"/></view>
			</view>
			<!-- 已有选项 -->
			<view class="choice" v-for="(choice,index) in choices">
				<view class="text">{{choice.value}}</view>
				<view class="buttons">
					<view class="button" :class="choice.default? 'on':'off'" @click="switchDefault(index)">设为默认</view>
					<view class="button" @click="deleteChoice(index)">删除</view>
				</view>
			</view>
			<!-- 新增选项输入 -->
			<view class="newChoice">
				<input v-model="newChoice" placeholder="新增选项"/>
				<view class="button" @click="addChoice">新增</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts" name="">
import { inject, reactive, ref, shallowReactive, toRaw, watch } from 'vue'; 
import { showQuickInfo } from '../../../api/showQuickInfo';
	const status = inject('status');
// 范围输入栏
	let rangeMin = ref(0)
	let rangeMax = ref(100)
	const adjustRange = () => {
	    if (rangeMin.value > rangeMax.value) {
	      rangeMax.value = rangeMin.value + rangeStep.value;
	    }
	    if (rangeMax.value < rangeMin.value) {
	      rangeMin.value = rangeMax.value - rangeStep.value;
	    }
		
	};
	watch([rangeMin, rangeMax], adjustRange);
	let rangeStep = ref(1)
	watch(rangeStep,()=>{
		if(rangeStep.value<0){
			showQuickInfo("单位值不能小于0")
			rangeStep.value = 1
		}
	})
	watch([rangeMin,rangeMax,rangeStep],()=>{
		status["setting"]["range"] = [rangeMin.value,rangeMax.value,rangeStep.value]
	},{immediate:true
	})
	
// 选择输入栏
	let chooseMin = ref(0)
	// 最少选择数量大于0
	watch(chooseMin,()=>{
		if(chooseMin.value < 0){
			chooseMin.value = 0
		}
	})
	let chooseMax = ref(0)
	//最大选择数量小于choices的长度
	watch(chooseMax,()=>{
		if(chooseMax.value > choices.length){
			chooseMax.value = choices.length
		}
	})
	watch([chooseMax,chooseMax],()=>{
		status["setting"]["chooseNum"] = [chooseMin.value,chooseMax.value]
	})
	let choices = reactive([])
	let newChoice = ref()
	// 添加选项
	function addChoice(){
		const tmp = newChoice.value
		newChoice.value = "" //清空
		if(!tmp || tmp == ""){
			showQuickInfo("选项不能为空")
			return false
		}
		const choice = tmp
		choices.push({value:choice})
		status["setting"]["choices"] = toRaw(choices)
		// 初始化最大选择数量
		if(chooseMax.value == 0){
			chooseMax.value = 1
		}
	}
	// 删除选项
	function deleteChoice(index:number){
		choices.splice(index,1)
		status["setting"]["choices"] = toRaw(choices)
	}
	// 切换默认选项
	function switchDefault(index:number){
		const choice = choices[index]
		// 若已经是默认选项了
		if(choice["default"] == true){
			delete choice.default
		}
		else{
			choice["default"] = true 
		}
		status["setting"]["choices"][index] = choice
	}
</script>

<style lang="scss" scoped>
	.range{
		.top{
			display: flex;
		}

		
	}
	.choose{
		.chooseNum{
			display: flex;
		}
		
		.choice{
			display: flex;
			.buttons{
				display: flex;
				.button{
					
				}
				.button.on{
					background-color: white;
				}
				.button.off{
					background-color: grey;
				}
			}
		}
		.newChoice{
			display: flex;
		}
	}
	.halfInput{
		display: flex;
		white-space: nowrap;
		width: 45%;
		padding:0 2.5%;
		input{
			text-align: right;
		}
	}
</style>