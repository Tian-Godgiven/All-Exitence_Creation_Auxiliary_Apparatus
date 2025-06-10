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
				v-slot="{item:part,index}" 
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
			<div @click="showExpressionPopUp('expression')" class="button">添加表达式</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="">
import { ref, shallowRef, toRaw } from 'vue'; 
import draggableListVue from '@/components/other/DraggableList.vue';
import { showPopUp } from '@/hooks/pages/popUp';
import textInputVue from "@/components/other/textInput.vue";
import { showQuickInfo } from '@/api/showQuickInfo';
import multiStatusExpressionVue from '@/popUps/expression/multiStatusExpression.vue';
import inputVue from '@/components/other/input/downLineInput.vue'
import { statusValueTypeList } from '@/static/list/statusValueList';
import { MultiStatusPart } from '@/hooks/expression/multiStatusValue';
import { showCreateStatusPopUp } from '@/hooks/all-exitence/status';
import Status from '@/interfaces/Status';
import { showChooseFromListPopUp } from '@/api/chooseFromList';
import { ExitenceStatus } from '@/class/Exitence';
	// 未完成：不再依赖传入的allStatus，而是使用target来获取对象，从而得到属性
	const {status,fullStatus} = defineProps<{
		status:Status|ExitenceStatus,
		fullStatus:Status
	}>()
	const allStatus:Status[] = []

	// 当前复合属性的值，数组内依次保存各个复合属性对象
	const multiValue = ref<MultiStatusPart[]>(fullStatus.value ?? [])
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
		const newPart:MultiStatusPart = {
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
		multiValue.value.forEach((thePart:MultiStatusPart) => {
			if(key!="" && key == thePart.__key && toRaw(part) != toRaw(thePart)){
				showQuickInfo("部分的关键字不得重复.")
				part.__key = ""
			}
		})
	}
	// 引用相应part
	function quotePart(part:MultiStatusPart){
		if(!part.__key){
			showQuickInfo("需要为相应的部分设置关键字")
			return false
		}
		createNewPart(part.__key,"quotePart")
	}
	//在页面上显示part的值
	function showPartValue(part:MultiStatusPart,index:number){
		//属性
		if(part.valueType == "statusValue"){
			//显示这个属性的类型名称（中文）
			const tmp = statusValueTypeList.find((tmp)=>{
				if(tmp.value == part.value.valueType){
					return tmp
				}
			})
			return tmp?.label + "属性"
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
			const targetPart = multiValue.value.find((parts:MultiStatusPart)=>parts.__key == part.value)
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
	// 显示编辑表达式弹窗
	function showExpressionPopUp(type:string){	
		showPopUp({
			vue:shallowRef(multiStatusExpressionVue),
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
	// 显示选择属性弹窗，选择当前属性对应的对象中的已有属性
	function showQuoteStatusPopUp(){
		showChooseFromListPopUp<Status>({
			list:allStatus,
			info:"点击选择引用属性",
			emptyInfo:"当前无可选属性",
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
			returnValue : (array)=>{
				array.forEach((status)=>{
					//只要其中的__key
					const value = status.__key
					createNewPart(value,"quoteStatus")
				})
			},
		},{
			buttons : [],
			mask : true,
			size:{
				height:"50%"
			}
		})
	}
	// 显示创建属性弹窗，这个弹窗的尺寸和参数不一样
	function showStatusValueInput(){
		showCreateStatusPopUp({
			popUpSet:{
				mask:true,
				size:{
					height:"50%"
				}
			}, 
			banValueType:["multi","status"],
			returnValue:(status)=>{
				createNewPart(status,"statusValue")
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