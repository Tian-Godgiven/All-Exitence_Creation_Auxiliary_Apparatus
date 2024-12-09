<template>
	<div class="multi">
		<!-- 管理part -->
		<div class="manageParts">
			<div class="part">
				<div class="value">值</div>
				<div class="key">关键字</div>
			</div>
			<draggableListVue @dragEnd="changeStatusValue" v-slot="{element:part,index}" :list = "multiValue">
				<div class="part">
					<div class="value">{{showPartValue(part,index)}}</div>
					<div class="key">
						<inputVue
							v-model="part.__key" @blur="checkPartKey(part)"/>
					</div>
					<div class="quotePart" @click="quotePart(part)">引</div>
					<div class="delete" @click="deletePart(index)">删</div>
				</div>
			</draggableListVue>
			
		</div>
		<!-- 新建part --> 
		<div class="buttons">
			<div @click="showMultiValuePopUp('text')" class="button">添加文本</div>
			<div @click="showQuoteStatusPopUp()" class="button">引用属性</div>
			<div @click="createNewPart('换行','enterLine')" class="button">换行</div>
		</div>
		<div class="buttons">
			<div @click="showStatusValueInput()" class="button">添加属性值</div>
			<div @click="showMultiValuePopUp('expression')" class="button">添加表达式</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="">
import { inject, ref, shallowRef } from 'vue'; 
import draggableListVue from '@/components/other/draggableList/draggableList.vue';
import { showPopUp } from '@/hooks/popUp';
import textInputVue from "@/components/popUps/others/textInput.vue";
import { showQuickInfo } from '@/api/showQuickInfo';
import inputStatusValueVue from '@/popUps/all-exitence/inputStatusValue.vue';
import multiStatusExpressionVue from '@/popUps/expression/multiStatusExpression.vue';
import chooseFromListVue from '@/components/popUps/others/chooseFromList.vue';
import inputVue from '@/components/other/input/downLineInput.vue'
	//不同按键对应的各个弹窗对象
	const multiBonusPopUpList:{[key:string]:any} = {
		"text":shallowRef(textInputVue),
		"quoteStatus":shallowRef(chooseFromListVue),
		"statusValue":shallowRef(inputStatusValueVue),
		"expression":shallowRef(multiStatusExpressionVue)
	}

	export interface multiStatusPart{
		value:any,
		valueType:string,
		__key:string
	}
	const status = inject<any>("status")
	const typeStatus = inject<any>("typeStatus")
	// 当前复合属性的值，数组内依次保存各个复合属性对象
	const multiValue = ref(status.value ? status.value : [])
	// 将属性值同步到属性上
	function changeStatusValue(){
		status.value = multiValue.value
		console.log(multiValue.value)
	}
	// 创建新的part并push进去
	function createNewPart(value:any,type:string){
		if(!value || value==""){
			return false
		}
		// 新的part
		const newPart:multiStatusPart = {
			value : value,
			valueType : type,
			__key : ""
		}
		multiValue.value.push(newPart)
		changeStatusValue()
	}
	// 检查part的关键字是否重复
	function checkPartKey(part:any){
		const key = part.__key
		const ifRepeated = multiValue.value.find((thePart:multiStatusPart)=>
			key!="" && key == thePart.__key && part != thePart
		)
		if(ifRepeated){
			showQuickInfo("部分的关键字不得重复.")
			part.__key = ""
		}
	}
	// 引用相应part
	function quotePart(part:multiStatusPart){
		if(!part.__key){
			showQuickInfo("需要为相应的部分设置关键字")
			return false
		}
		createNewPart(part.__key,"quotePart")
	}
	//在页面上显示part的值
	function showPartValue(part:multiStatusPart,index:number){
		if(part.valueType == "statusValue"){
			return "属性值:" + part.value.name
		}
		else if(part.valueType == "quoteStatus"){
			const theStatus = typeStatus["value"].find((status:any)=>status.__key == part.value)
			if(theStatus){
				return "引用属性:" + theStatus.name
			}
			else{
				showQuickInfo("引用已失效，引用对象不存在。")
				deletePart(index)
				return false
			}
		}
		else if(part.valueType == "quotePart"){
			const targetPart = multiValue.value.find((parts:multiStatusPart)=>parts.__key == part.value)
			if(targetPart){
				part.value = targetPart.__key
				return "引用部分:" + part.value
			}
			else{
				showQuickInfo("引用已失效，请勿在引用后修改引用对象的关键字。")
				deletePart(index)
				return false
			}
		}
		else{
			return part.value
		}
	}
	// 删除part
	function deletePart(index:number){
		multiValue.value.splice(index,1)
		changeStatusValue()
	}
	// 显示对应的弹窗
	function showMultiValuePopUp(type:string){		
		showPopUp({
			vue:multiBonusPopUpList[type],
			props:{
				parts:multiValue,
				typeStatus:typeStatus
			},
			buttons : [],
			mask : true,
			returnValue : (value)=>{
				createNewPart(value,type)
			},
			size:{
				width:"600px",
				height:"auto"
			}
		})
	}
	// 显示属性选择弹窗
	function showQuoteStatusPopUp(){
		showPopUp({
			vue:multiBonusPopUpList["quoteStatus"],
			props:{
				list:typeStatus,
				info:"点击选择引用属性",
				empty:"当前无可选属性",
				//允许选择非复合属性和非嵌套的属性
				selectRule:(status:any)=>{
					if(status.valueType != "multi" && status.valueType != 'status'){
						return true
					}
					return false
				},
				showValue:(status:any)=>{
					return status.name
				},
				chooseValue:(status:any)=>{
					return status.__key
				}
			},
			buttons : [],
			mask : true,
			returnValue : (value)=>{
				createNewPart(value,"quoteStatus")
			},
			size:{
				width:"600px",
				height:"50%"
			}
		})
	}
	// 显示属性输入弹窗，这个弹窗的尺寸和参数不一样
	function showStatusValueInput(){
		showPopUp({
			vue:multiBonusPopUpList["statusValue"],
			props:{
				banValueType:["multi","status"]
			},
			buttons : [],
			mask : true,
			returnValue : (value)=>{
				createNewPart(value,"statusValue")
			},
			size:{
				width:"600px",
				height:"50%"
			}
		})
	}
</script>

<style lang="scss" scoped>
	.multi{
		width: 100%;
		height: 100%;
		.manageParts{
			.part{
				width: 100%;
				display: flex;
				padding: 10px 0;
				.value{
					width: 200px;
				}
				.key{
					width: 150px;
					input{
						width: 100%;
					}
				}
				.type{
					width: 100px;
				}
				.delete{
					width: 50px;
				}
			}
		}
		.buttons{
			display: flex;
			width: 100%;
			.button{
				border: 3px solid black;
				padding:5px 15px;
				box-sizing: border-box;
			}
			
		}
	}
</style>