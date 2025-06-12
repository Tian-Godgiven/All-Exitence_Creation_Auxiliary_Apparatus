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
import Status from '@/interfaces/Status';
import { ExitenceStatus } from '@/class/Exitence';
import { getStatusSettingValue } from '@/hooks/all-exitence/status';
	const {status,fullStatus} = defineProps<{
		status:Status|ExitenceStatus,
		fullStatus:Status
	}>()	
	//初始化
	if(!Array.isArray(status.value)){
		status.value = []
	}
	// 选项数组
	const choiceList = computed(()=>{
		const settingValue = getStatusSettingValue<string>(fullStatus.setting,"choices","arr") ?? []
		return settingValue
	})
	// 选择数量
	const min = computed(()=>{
		const chooseNum = getStatusSettingValue<number>(fullStatus.setting,"chooseNum","arr") ?? []
		return chooseNum[0] ?? 0
	})
	const max = computed(()=>{
		const chooseNum = getStatusSettingValue<number>(fullStatus.setting,"chooseNum","arr") ?? []
		return chooseNum[1] ?? 1
	})

	//属性设置：使用灯开关表示选项
	const ifRadio = computed(()=>{
		const ifRadio = getStatusSettingValue(fullStatus.setting,"ifRadio","bool") ?? false
		return ifRadio
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
		const ifVertical = getStatusSettingValue(fullStatus.setting,"chooseDirection","bool") ?? false
		return ifVertical
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