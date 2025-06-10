<template>
	<!-- 选项栏 -->
	<div class="choose">
		<div class="chooseNum">
			<div class="halfInput">最多选择:
				<downLineInputVue
					@blur="setChooseNum" v-model.number="chooseMax"
					type="number"/>
			</div>
		</div>
		<!-- 已有选项 -->
		<div class="choices">
			<div class="choice" v-for="(choice,index) in choices">
				<div class="text">{{choice}}</div>
				<div class="button" @click="deleteChoice(index)">删除</div>
			</div>
		</div>
		
		<!-- 新增选项输入 -->
		<div class="newChoice">
			<downLineInputVue
				class="input"
				v-model="newChoice" 
				placeholder="新增选项"/>
			<div class="button" @click="addChoice">新增</div>
		</div>
	</div>

</template>

<script setup lang="ts" name="">
import { reactive, ref, toRaw } from 'vue'; 
import { showQuickInfo } from '@/api/showQuickInfo';
import downLineInputVue from '@/components/other/input/downLineInput.vue';
import { ExitenceStatus } from '@/class/Exitence';
import Status from '@/interfaces/Status';
import { getStatusSettingValue, setStatus } from '@/hooks/all-exitence/status';

	const {status,fullStatus} = defineProps<{
        status:Status|ExitenceStatus,
        fullStatus:Status
    }>()
	// 选择数量输入栏,不可以设定最小选择数量
	const chooseNumValue = getStatusSettingValue<number>(fullStatus.setting,"chooseNum","arr")??[0,1]
	const chooseMax = ref(chooseNumValue[1])
	const setChooseNum = ()=>{
		setStatus(status,"chooseNum",[0,chooseMax.value])
	}
	// 选项
	const choicesValue = getStatusSettingValue<any>(fullStatus.setting,"choices","arr")??[]
	const choices = reactive<any[]>(choicesValue)
	// 添加选项
	const newChoice = ref()
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
		setStatus(status,"choices",toRaw(choices))
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
		setStatus(status,"choices",toRaw(choices))
	}

</script>

<style lang="scss" scoped>
	@use "@/static/style/components/inputs.scss";
	.choose{
		.chooseNum{
			display: flex;
		}
		.choices{
			display: flex;
			.choice{
				display: flex;
			}
		}
		
		.newChoice{
			display: flex;
			width: 100%;
			.input{
				font-size: 1rem;
				width: calc(100% - 80px);
				padding: 5px;
				box-sizing: border-box;
			}
			.button{
				width: 80px;
			}
		}
	}
	.halfInput{
		@extend .halfInput;
	}
</style>