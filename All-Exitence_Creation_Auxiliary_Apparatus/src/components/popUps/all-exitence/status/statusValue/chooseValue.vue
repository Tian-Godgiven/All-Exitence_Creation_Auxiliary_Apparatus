<template>
	<div class="value">
		<ElCheckboxGroup :min="min" :max="max" v-model="chosenList" >
			<ElCheckbox
				:value="choice"
				v-for="(choice) in choiceList"
				class="checkbox" 
				@change="takeChoose">{{choice}}
			</ElCheckbox>
		</ElCheckboxGroup>
	</div>
</template>

<script setup lang="ts" name="">
import { computed, inject, ref, toRaw } from 'vue'; 
import { ElCheckboxGroup,ElCheckbox } from 'element-plus';
	const status = inject<any>("status")
	const changeStatusValue = inject<(value:any)=>any>('changeStatusValue',()=>{})
	// 选项数组
	const choiceList = computed(()=>{
		return status["setting"]['choices']
	})
	// 选择数量
	const min = computed(()=>{
		return status["setting"]['chooseNum'][0]
	})
	const max = computed(()=>{
		return status["setting"]['chooseNum'][1]
	})
	
	
	// 已选择选项数组
	const chosenList = ref(status['value']?status['value']:[])
	// 选择一个选项
	const takeChoose = ()=>{
		changeStatusValue(toRaw(chosenList.value))
	}
	
</script>

<style lang="scss" scoped>
	.value{
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
		}
	}
</style>