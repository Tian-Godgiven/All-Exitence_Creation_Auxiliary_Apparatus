<template>
	<view class="newStatus">
		<view class="statusInfo">
			<!-- 输入属性名 -->
			<view class="inputName">
				<input v-model="name" class="downLine" placeholder="属性名"/>
			</view>
			<!-- 选择属性值类型 -->
			<uni-data-select
				@change="changeValueType"
				:clear="false"
				class="valueType"
				v-model="valueType"
				:localdata="valueTypes">
			</uni-data-select>
			<view class="button" @click="createTypeStatus">新建</view>
		</view>
		<!-- 额外输入栏 -->
		<bonusInputVue></bonusInputVue>
		
		<view class="statusSet">
			<!-- 选择属性值显示方式 -->
			<uni-data-select 
				:clear="false"
				class="showType" 
				v-model="showType"
				:localdata="showTypes">
			</uni-data-select>
			<view class="button" @click="switchSetting">高级设置</view>
		</view>
		<view class="settingBox" :class="setNewStatus? 'settingBox-show':''">
			<settingBoxOptionVue 
				v-for="(option,index) in setOptions" 
				:setOption="option"
				:ref="`option-${index}`">
			</settingBoxOptionVue>
		</view>

		
	</view>
</template>

<script setup lang="ts" name=""> 
import { computed, provide, reactive, ref, watch } from 'vue'; 
import { statusSettingList, statusShowTypeList, statusValueTypeList } from '../../../data/list/statusValueList';
import settingBoxOptionVue from './settingBoxOption.vue';
import bonusInputVue from './bonusInput.vue';

// 新增属性
	let name = ref("")
	let valueType = ref("string")
	let showType = ref()
	let newStatus = reactive({
		name,
		valueType,
		showType,
		setting:{},
	})
// 修改属性设置
	function setStatus(name:string,value:any){
		newStatus.setting[name] = value
	}
	provide("status",newStatus)
	//切换属性类型时，清空setting
	function changeValueType(){
		newStatus.setting = {}
	}
// 新增属性类型
	let valueTypes = statusValueTypeList
// 新增属性样式
	let showTypes = computed(()=>{
		return [result.defaultShowType,...result.compatibleShowTypes]
	})
	const result = reactive({
		defaultShowType: { value: '', text: '' },
		compatibleShowTypes: []
	});
	// 获取默认样式和符合样式
	watch(valueType,()=>{
		result.compatibleShowTypes = []
		statusShowTypeList.forEach((showTypes)=>{
			if(showTypes.defaultType.includes(valueType.value)){
				result.defaultShowType = {value:showTypes.value,text:showTypes.text}
				showType.value = showTypes.value
			}
			else if(showTypes.compatibleType.includes(valueType.value)){
				result.compatibleShowTypes.push({value:showTypes.value,text:showTypes.text})
			}
		})
	},{
		immediate:true
	})
// 新增属性的设置
	// 切换属性Box的显示
	let setNewStatus = ref(false)
	function switchSetting(){
		setNewStatus.value = !setNewStatus.value
	}
	// 属性box的选项内容
	let setOptions = reactive([])
	// 选项子组件
	const optionRefs = setOptions.map((_, index) => ref(null));
	watch(newStatus,()=>{
		setOptions = statusSettingList.reduce((acc,option)=>{
			//满足select需求
			if(!option.select || option.select(newStatus) == true){
				acc.push(option)
			}
			return acc
		},[])
	},{
		immediate:true
	})
	
// 确认新增属性
	let emit = defineEmits(["createStatus"])
	function createTypeStatus(){
		let tmp = true
		//依次调用各个设置项的confirmValue函数，
		optionRefs.forEach((childRef) => {
			// 其中任一设置项返回false时，不创建该分类属性
			if(childRef.value.confirmValue() !== true){
				tmp = false
			} 
		});
		if(!tmp){
			return false
		}
		// 要求name不能为空
		if(name.value == ""){
			uni.showToast({
				title:"属性名不能为空",
				icon:"none"
			})
			return false
		}
		
		// 将当前分类属性的数据传递回创建分类组件，形成新的属性
		const newTypeStatus = {
			name:name.value,
			valueType:valueType.value,
			showType:showType.value,
			setting:newStatus.setting,
		}
		emit("createStatus",newTypeStatus)
	}
	
	
</script>

<style lang="scss" scoped>
@import "@/static/style/components/inputs.scss";
	.newStatus{
		border:2rpx dashed black;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		padding: 10rpx 20rpx;
		.statusInfo{
			display: flex;
			height: 100rpx;
			align-items: center;
			.inputName{
				width: 280rpx;
				box-sizing: border-box;
				margin-right: 20rpx;
			}
			.valueType{
				width: calc(100% - 400rpx);
				margin: 0 10rpx;
			}
			.button{
				box-sizing: border-box;
				margin-left: 10rpx;
				width: 80rpx;
				height: 80rpx;
				border:3rpx solid black;
			}
		}
		.statusSet{
			display: flex;
			align-items: center;
			height: 100rpx;
			.showType{
				width: calc(70% - 10rpx);
				margin-right: 10rpx;
			}
			.button{
				width: 20%;
				height: 60rpx;
				border: 3rpx solid black;
			}
		}
		.settingBox{
			max-height: 0rpx;
			width: 100%;
			overflow: hidden;
			transition: max-height 450ms ease-in-out;
		}
		.settingBox-show{
			max-height: 300rpx;
		}
	}
	
	
</style>