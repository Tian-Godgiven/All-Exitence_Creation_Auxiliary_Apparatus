<template>
	<div class="multi">
		<!-- 管理part -->
		<div class="manageParts">
			<div class="part">
				<div class="value">值</div>
				<div class="key">关键字</div>
			</div>
			<draggableListVue 
				@dragEnd="changeStatusValue" 
				v-slot="{element:part,index}" 
				:dragHandle="true"
				:list = "multiValue">
				<div class="part">
					<div class="value">{{showPartValue(part,index)}}</div>
					<div class="key">
						<inputVue
							v-model="part.__key" 
							@blur="checkPartKey(part)"
						/>
					</div>
					<div class="quotePart" @click="quotePart(part)">引</div>
					<div class="delete" @click="deletePart(index)">删</div>
				</div>
			</draggableListVue>
			
		</div>
		<!-- 新建part --> 
		<div class="buttons">
			<div @click="showInputTextPopUp()" class="button">添加文本</div>
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
import { inject, ref, shallowRef, toRaw } from 'vue'; 
import draggableListVue from '@/components/other/draggableList/draggableList.vue';
import { showPopUp } from '@/hooks/pages/popUp';
import textInputVue from "@/components/other/textInput.vue";
import { showQuickInfo } from '@/api/showQuickInfo';
import multiStatusExpressionVue from '@/popUps/expression/multiStatusExpression.vue';
import chooseFromListVue from '@/components/other/chooseFromList.vue';
import inputVue from '@/components/other/input/downLineInput.vue'
import { statusValueTypeList } from '@/static/list/statusValueList';
import { multiStatusPart } from '@/hooks/expression/multiStatusValue';
	//不同按键对应的各个弹窗对象
	const multiBonusPopUpList:{[key:string]:any} = {
		"quoteStatus":shallowRef(chooseFromListVue),
		"expression":shallowRef(multiStatusExpressionVue)
	}
	const status = inject<any>("status")
	const allStatus = inject<any>("allStatus")
	const allTypeStatus = inject<any>("allTypeStatus")
	// 当前复合属性的值，数组内依次保存各个复合属性对象
	const multiValue = ref(status.value ?? [])
	// 将值同步回属性上
	function changeStatusValue(){
		status.value = toRaw(multiValue.value)
	}
	// 创建并添加新的part
	function createNewPart(value:any,type:string){
		if(value == null || value === ""){
			return false
		}
		let key = ""
		if(type == "statusValue"){
			key = value.name
		}
		// 新的part
		const newPart:multiStatusPart = {
			value : value,
			valueType : type,
			__key : key
		}
		multiValue.value.push(newPart)

		checkPartKey(newPart)
		changeStatusValue()
	}
	// 检查part的关键字是否重复
	function checkPartKey(part:any){
		const key = part.__key
		multiValue.value.forEach((thePart:multiStatusPart) => {
			if(key!="" && key == thePart.__key && toRaw(part) != toRaw(thePart)){
				showQuickInfo("部分的关键字不得重复.")
				part.__key = ""
			}
		})
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
		//属性
		if(part.valueType == "statusValue"){
			//显示这个属性的类型名称（中文）
			const tmp = statusValueTypeList.find((tmp)=>{
				if(tmp.value == part.value.valueType){
					return tmp
				}
			})
			return tmp?.text + "属性"
		}
		else if(part.valueType == "quoteStatus"){
			const theStatus = allStatus.find((status:any)=>status.__key == part.value)
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
		else if(part.valueType == "expression"){
			return "属性表达式"
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
				mode:"string",
				parts:multiValue,
				typeStatus:allStatus
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
	// 显示输入文本弹窗，只能输入字符串
	function showInputTextPopUp(){
		showPopUp({
			vue:shallowRef(textInputVue),
			props:{
				mode:"string",
			},
			buttons : [],
			mask : true,
			returnValue : (value)=>{
				createNewPart(value,"text")
			},
			size:{
				width:"600px",
				height:"auto"
			}
		})
	}
	// 显示选择列表弹窗，选择已有属性
	function showQuoteStatusPopUp(){
		showPopUp({
			vue:multiBonusPopUpList["quoteStatus"],
			props:{
				list:allStatus,
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
			returnValue : (array)=>{
				array.forEach((value:any)=>{
					createNewPart(value,"quoteStatus")
				})
			},
			size:{
				width:"600px",
				height:"50%"
			}
		})
	}
	// 显示创建属性弹窗，这个弹窗的尺寸和参数不一样
	function showStatusValueInput(){
		showPopUp({
			name:"新增属性",
			vueName:"createStatus",
			props:{
				banValueType:["multi","status"],
				allStatus,
				allTypeStatus
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
					width: 270px;
				}
				.key{
					width: 150px;
					input{
						width: 100%;
					}
				}
				.quotePart{
					width: 50px;
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