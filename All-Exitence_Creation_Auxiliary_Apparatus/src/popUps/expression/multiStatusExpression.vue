<template>
	<div>
		<!-- 显示区 -->
		<div class="divArea">
			<div v-for="(item) in items" :class="item.type">
				{{itemValue(item)}}
			</div>
		</div>
		<!-- 输入区 -->
		<div class="inputArea">
				<div class="input">
					<input class="inputValue" v-model="inputValue" />
					<div @click = "inputConfirm">确认</div>
				</div>
				<div @click="clickButton('+')">+</div>
				<div @click="clickButton('-')">-</div>
				<div @click="clickButton('backSpace')" class="backSpace">退格</div>
				
				<div @click="quoteStatus">引用属性</div>
				<div @click="clickButton('*')">*</div>
				<div @click="clickButton('/')">/</div>
				
				
				<div @click="quotePart">引用部分</div>
				<div @click="clickButton('%')">%</div>
				<div @click="clickButton('^')">次方</div>
				<div @click="clickButton('^^')">开方</div>
		</div>
		<div>报错</div>
	</div>
</template>

<script setup lang="ts" name="">
import { ref, shallowRef } from 'vue'; 
import { showPopUp } from '@/hooks/popUp';
import chooseFromListVue from '@/components/popUps/others/chooseFromList.vue';

	const {props,popUp,returnValue} = defineProps(["props","popUp","returnValue"])
	const {parts,typeStatus} = props
	const items = ref<any[]>([])
	
	// 添加元素
	function addItem(value,type){
		items.value.push({value,type})
		checkExpression()
	}
	// 元素显示的内容
	function itemValue(item){
		return item.value
	}
	// 检查表达式:item之间的排列是否符合规范
	function checkExpression(){
		let lastItem
		//两个item之间用单个符号链接
		items.value.forEach((item)=>{
			if(!lastItem){
				lastItem = item
			}
			else{
				if(lastItem.type == "simbol" && item.type != "simbol"){
					return 
				}
				else if(item.type == "simbol" && lastItem.type != "simbol"){
					
				}
			}
		})
	}
	// 输入框
	const inputValue = ref()
	function inputConfirm(){
		addItem(inputValue.value,"text")
		inputValue.value = ""
	}
	// 弹出选择引用属性页面
	function quoteStatus(){
		showPopUp({
			vue:shallowRef(chooseFromListVue),
			props:{
				list:typeStatus,
				info:"点击选择引用属性",
				empty:"当前无可选属性",
				//允许选择非复合属性和非嵌套的属性
				selectRule:(status)=>{
					if(status.valueType != "multi" && status.valueType != 'status'){
						return true
					}
					return false
				},
				showValue:(status)=>{
					return status.name
				},
				chooseValue:(status)=>{
					return status.__key
				}
			},
			buttons : [],
			mask : true,
			returnValue : (value)=>{
				addItem(value,"quoteStatus")
			},
			size:{
				width:"600px",
				height:"auto"
			}
		})
	}
	// 弹出选择引用部分页面
	function quotePart(){
		showPopUp({
			vue:shallowRef(chooseFromListVue),
			props:{
				list:parts,
				info:"点击选择引用部分",
				empty:"当前无可选部分",
				//允许选择非换行的部分，并且该部分应具备关键字
				selectRule:(part)=>{
					if(part.valueType != "enterLine" && part.__key && part.__key != ""){
						return true
					}
					return false
				},
				showValue:(part)=>{
					return part.__key
				},
				chooseValue:(part)=>{
					return part.__key
				}
			},
			buttons : [],
			mask : true,
			returnValue : (value)=>{
				addItem(value,"quotePart")
			},
			size:{
				width:"600px",
				height:"auto"
			}
		})
	}
	// 运算符号
	function clickButton(name){
		if(name == "backSpace"){
			items.value.pop()
		}
		else{
			addItem(name,"simbol")
		}
	}
</script>

<style lang="scss" scoped>
	.divArea{
		width: 100%;
		height: 120px;
		border: 5px dashed black;
		border-radius: 10px;
		margin-bottom: 30px;
		display: flex;
		// 输入的文本内容显示
		.text{
			
		}
		// 输入的引用属性显示
		.quoteStatus{
			
		}
		.quotePart{
			
		}
	}
	.inputArea{
		display: grid;
		grid-template-columns: 3fr 1fr 1fr 1fr; /* 三列，分别是 1fr, 2fr 和 1fr */
		grid-template-rows: 30% 30% 30%; /* 三行，第一行 100px 高，第二行自适应，第三行 50px 高 */
		gap: 10px;
		.backSpace{
			grid-column: 4;
			grid-row: span 2
		}
		.input{
			display: flex;
			border:3px solid black;
			border-radius: 10px;
			padding: 0 10px;
			.inputValue{
				height: 100%;
			}
		}
	}
</style>