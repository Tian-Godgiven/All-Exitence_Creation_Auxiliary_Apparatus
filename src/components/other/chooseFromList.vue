<template>
	<div class="chooseFromList">
		<div>
			<span v-if="showList.length>0">{{info??"点击选择选项"}}</span>
			<span v-else>{{emptyInfo??"当前无可选项"}}</span>
		</div>
		<div class="showList">
			<div v-for="(option,index) in showList" 
				class="option" :class="chosenIndex.includes(index)?'selected':''"
				@click="chooseOption(option,index)">
				{{showValue?showValue(option):option}}
			</div>
		</div>
		<FinalButtons :buttons="[
			{click:confirm,name:'确认'},
			{click:()=>closePopUp(popUp),name:'取消'}]"/>
	</div>
</template>

<script setup lang="ts" name="">
import { ref, toRaw } from 'vue';
import { closePopUp } from '../../hooks/pages/popUp';
import FinalButtons from '@/app/stacks/popUp/FinalButtons.vue';
	
const {props,returnValue,popUp} = defineProps(["props","returnValue","popUp"])
	const {list,emptyInfo,info,chooseNum,selectRule,showValue,chooseValue} = props
	//允许显示的项
	let showList:any
	if(selectRule){
		const tmp = list.reduce((acc:any[],cur:any)=>{
			// 需要满足selectRule
			if(selectRule(cur)){
				acc.push(cur)
			}
			return acc
		},[])
		showList = tmp
	}
	else{
		showList = list
	}

	if(chooseNum){
		//未完成
	}
	
	
	
	
	//已选择的属性对象
	const chosenOption = ref<any>([])
	const chosenIndex = ref<number[]>([])
	// 选择指定的属性对象
	function chooseOption(option:any,index:number){

		//若已经选中则删除
		if(chosenIndex.value.includes(index)){
			const idx = chosenIndex.value.indexOf(index)
			chosenOption.value.splice(idx,1)
			chosenIndex.value.splice(idx,1)
		}
		//否则添加这个选项
		else{
			//如果定义了选项值的要求，则对选项进行处理，填装处理后的值
			if(chooseValue){
				chosenOption.value.push(chooseValue(option))
			}
			//否则直接填装选项本身
			else{
				chosenOption.value.push(option)
			}
			chosenIndex.value.push(index)
		}
	}
	// 确认，返回已选择的属性对象的key
	function confirm(){
		if(chosenOption.value.length > 0){
			returnValue(toRaw(chosenOption.value))
		}
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