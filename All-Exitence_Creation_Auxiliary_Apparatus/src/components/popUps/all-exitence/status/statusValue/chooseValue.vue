<template>
	<div class="chooseValue" :class="ifVertical?'vertical':'horizontal'">
		<ElCheckboxGroup v-if="!ifRadio" :min="min" :max="max" v-model="status.value" >
			<ElCheckbox
				:value="choice"
				v-for="(choice) in choiceList"
				class="checkbox">
				{{choice}}
			</ElCheckbox>
		</ElCheckboxGroup>
		
		<div v-else-if="ifRadio" class="choice">
			<div class="radioChoice" v-for="(choice,index) in choiceList">
				<radioVue v-model="chosenList[index]" @change="takeChoose"></radioVue>
				<div>{{ choice }}</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="">
import { computed, reactive } from 'vue'; 
import radioVue from '@/components/other/radio.vue';
import { ElCheckboxGroup,ElCheckbox } from 'element-plus';
	const {status,statusSetting} = defineProps(['status','statusSetting'])
	//初始化
	if(!Array.isArray(status.value)){
		status.value = []
	}
	// 选项数组
	const choiceList = computed(()=>{
		return statusSetting['choices'] ?? []
	})
	// 选择数量
	const min = computed(()=>{
		return statusSetting['chooseNum'][0]
	})
	const max = computed(()=>{
		return statusSetting['chooseNum'][1]
	})

	//属性设置：使用灯开关表示选项
	const ifRadio = computed(()=>{
		if(statusSetting.chooseByRadio){
			return true
		}
		return false
	})
	// 灯开关选择
	const chosenList = reactive(new Array(choiceList.value.length).fill(false))
	function takeChoose(){
		status.value = chosenList.reduce((arr,cur,index)=>{
			//若为true(选择了)，则将对应的选项放入属性值中
			if(cur){
				arr.push(choiceList.value[index])
			}
			return arr
		},[])
	}
	// 属性设置：选项排列方向是否为竖向
	const ifVertical = computed(()=>{
		//(默认横向)
		if(statusSetting.chooseDirection == "vertical"){
			return true
		}
		return false
	})
	
</script>

<style lang="scss" scoped>
	.chooseValue{
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		.choice{
			display: flex;
			align-items: center;
			padding: 0 10px;
			.checkbox{
				:deep(){
					.el-checkbox__input.is-checked .el-checkbox__inner{
						background-color: black;
					}
					.el-checkbox__inner{
						background-color: lightblue;
					}
					.el-checkbox__inner::after{
						border-color: white;
					}
				}
			}
			.radioChoice{
				align-items: center;
				display: flex;
				padding: 0 10px;
			}
		}
	}
	// 垂直显示
	.chooseValue.vertical{
		label{
			display: block;
		}
		.choice{
			display: block;
			align-items: normal;
		}
	}
</style>