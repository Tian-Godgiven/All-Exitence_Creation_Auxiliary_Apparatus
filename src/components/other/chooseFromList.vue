<template>
<div class="chooseFromList">
	<div>
		<span v-if="showList.length>0">{{info??"点击选择选项"}}</span>
		<span v-else>{{emptyInfo??"当前无可选项"}}</span>
	</div>
	<div class="showList">
		<div v-for="(option,index) in showList" 
			class="option" 
			:class="chosenIndex.includes(index)?'selected':''"
			@click="chooseOption(option,index)">
			{{showValue?showValue(option):option}}
		</div>
	</div>
	<FinalButtons :buttons="[
		{click:confirm,name:'确认'},
		{click:()=>closePopUp(popUp),name:'取消'}]"/>
</div>
</template>

<script setup lang="ts" name="" generic="T">
import { ref } from 'vue';
import { closePopUp, PopUp } from '../../hooks/pages/popUp';
import FinalButtons from '@/app/stacks/popUp/FinalButtons.vue';
import { ChooseFromListProps } from '@/api/chooseFromList';
	
const {props,popUp} = defineProps<{
	props:ChooseFromListProps<T>,
	popUp:PopUp
}>()
	const {list,emptyInfo,info,chooseNum,selectRule,showValue,returnValue} = props
	//允许显示的项
	let showList:T[] = []
	if(selectRule){
		showList = list.flatMap(item=>{
			if(selectRule(item)){
				return item
			}
			return []
		})
	}
	else{
		showList = list
	}

	if(chooseNum){
		//未完成
	}
	
	//已选择的对象
	const chosenItem:T[] = []
	const chosenIndex = ref<number[]>([])
	// 选择指定的属性对象
	function chooseOption(option:T,index:number){
		//若已经选中则删除
		if(chosenIndex.value.includes(index)){
			const idx = chosenIndex.value.indexOf(index)
			chosenItem.splice(idx,1)
			chosenIndex.value.splice(idx,1)
		}
		//否则添加这个选项
		else{
			chosenItem.push(option)
			chosenIndex.value.push(index)
		}
	}
	// 确认，返回已选择的属性对象的key
	function confirm(){
		returnValue(chosenItem)
		closePopUp(popUp)
	}

</script>

<style lang="scss" scoped>
	.chooseFromList{
		.showList{
			width: 100%;
			box-sizing: border-box;
			padding: 20px 40px;
			.option.selected{
				background-color: lightblue;
			}
		}
	}
</style>