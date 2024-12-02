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
		<div class="buttons"> 
			<div @click="confirm" class="button">确认</div>
			<div @click="closePopUp(popUp)" class="button">取消</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="">
import { ref, toRaw } from 'vue';
import { closePopUp } from '../../../hooks/popUp';
	const {props,returnValue,popUp} = defineProps(["props","returnValue","popUp"])
	const {list,emptyInfo,info,chooseNum,selectRule,showValue,chooseValue} = props
	//允许显示的项
	console.log(list)
	let showList
	if(selectRule){
		const tmp = list.reduce((acc,cur)=>{
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
	
	
	
	//已选择的属性对象
	const chosenOption = ref([])
	const chosenIndex = ref([])
	// 选择指定的属性对象
	function chooseOption(option,index){
		//若已经选中则删除，否则添加
		if(chosenIndex.value.includes(index)){
			const idx = chosenIndex.value.indexOf(index)
			chosenOption.value.splice(idx,1)
			chosenIndex.value.splice(idx,1)
		}
		else{
			if(chooseValue){
				chosenOption.value.push(chooseValue(option))
			}
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
	@use "@/static/style/components/popUpButtons.scss";
	.chooseFromList{
		.showList{
			width: 100%;
			box-sizing: border-box;
			padding: 20px 40px;
			.option{
				
			}
			.option.selected{
				background-color: lightblue;
			}
		}
		.buttons{
			@extend .buttons
		}
	}
</style>