<template>
	<view class="multi">
		<!-- 管理part -->
		<view class="manageParts">
			<view class="part">
				<view class="value">值</view>
				<view class="key">关键字</view>
			</view>
			<draggableListVue @dragEnd="changeStatusValue" v-slot="{element:part,index}" :list = "multiValue">
				<view class="part">
					<view class="value">{{showPartValue(part,index)}}</view>
					<view class="key">
						<input v-model="part.__key" @blur="checkPartKey(part)"/>
					</view>
					<view class="quotePart" @click="quotePart(part)">引</view>
					<view class="delete" @click="deletePart(index)">删</view>
				</view>
			</draggableListVue>
			
		</view>
		<!-- 新建part --> 
		<view class="buttons">
			<view @click="showMultiValuePopUp('text')" class="button">添加文本</view>
			<view @click="showQuoteStatusPopUp('quoteStatus')" class="button">引用属性</view>
			<view @click="createNewPart('换行','enterLine')" class="button">换行</view>
		</view>
		<view class="buttons">
			<view @click="showStatusValueInput()" class="button">添加属性值</view>
			<view @click="showMultiValuePopUp('expression')" class="button">添加表达式</view>
		</view>
	</view>
</template>

<script setup lang="ts" name="">
import { inject, ref, shallowRef } from 'vue'; 
import draggableListVue from '../../../other/draggableList/draggableList.vue';
import { showPopUp } from '@/hooks/popUp';
import textInputVue from "@/components/popUps/others/textInput.vue";
import Status from '../../../../interfaces/exitenceStatus';
import { showQuickInfo } from '../../../../api/showQuickInfo';
import inputStatusValueVue from '../inputStatusValue.vue';
import multiStatusExpressionVue from '../../expression/multiStatusExpression.vue';
import chooseFromListVue from '../../others/chooseFromList.vue';
//用于显示弹窗内容
const multiBonusPopUpList = {
	"text":shallowRef(textInputVue),
	"quoteStatus":shallowRef(chooseFromListVue),
	"statusValue":shallowRef(inputStatusValueVue),
	"expression":shallowRef(multiStatusExpressionVue)
}

	const status = inject<Status>("status")
	const typeStatus = inject("typeStatus")
	// 总的复合属性值，依次保存各个复合属性对象
	const multiValue = ref(status.value ? status.value : [])
	// 将属性值同步到属性上
	function changeStatusValue(){
		status.value = multiValue.value
		console.log(multiValue.value)
	}
	// 创建新的part并push进去
	function createNewPart(value,type){
		if(!value || value==""){
			return false
		}
		// 新的part
		const newPart = {
			value : value,
			valueType : type,
			__key : ""
		}
		multiValue.value.push(newPart)
		changeStatusValue()
	}
	// 检查part的关键字是否重复
	function checkPartKey(part){
		const key = part.__key
		const ifRepeated = multiValue.value.find((thePart,index)=>
			key!="" && key == thePart.__key && part != thePart
		)
		if(ifRepeated){
			showQuickInfo("部分的关键字不得重复.")
			part.__key = ""
		}
	}
	// 引用相应part
	function quotePart(part){
		if(!part.__key){
			showQuickInfo("需要为相应的部分设置关键字")
			return false
		}
		createNewPart(part.__key,"quotePart")
	}
	//在页面上显示part的值
	function showPartValue(part,index){
		if(part.valueType == "statusValue"){
			return "属性值:" + part.value.name
		}
		else if(part.valueType == "quoteStatus"){
			const theStatus = typeStatus["value"].find((status)=>status.__key == part.value)
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
			const targetPart = multiValue.value.find((parts)=>parts.__key == part.value)
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
	function deletePart(index){
		multiValue.value.splice(index,1)
		changeStatusValue()
	}
	// 显示对应的弹窗
	function showMultiValuePopUp(type){		
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
				width:"600rpx",
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
				createNewPart(value,"quoteStatus")
			},
			size:{
				width:"600rpx",
				height:"50%"
			}
		})
	}
	// 这个弹窗的尺寸和参数不一样
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
				width:"600rpx",
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
				padding: 10rpx 0;
				.value{
					width: 200rpx;
				}
				.key{
					width: 150rpx;
				}
				.type{
					width: 100rpx;
				}
				.delete{
					width: 50rpx;
				}
			}
		}
		.buttons{
			display: flex;
			width: 100%;
			.button{
				border: 3rpx solid black;
				padding:5rpx 15rpx;
				box-sizing: border-box;
			}
			
		}
	}
</style>