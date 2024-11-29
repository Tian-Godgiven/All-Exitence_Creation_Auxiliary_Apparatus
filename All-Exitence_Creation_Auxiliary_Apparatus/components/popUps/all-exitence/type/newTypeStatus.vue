<template>
	<view class="newStatus">
		<view class="statusInfo">
			<!-- 属性名 -->
			<view class="statusName">
				<midTextAreaVue
					v-model="newStatus.name"
					placeholder="属性名">
				</midTextAreaVue>
				<view>：</view>
			</view>

			<!-- 属性值 -->
			<statusValueVue class="statusValue"></statusValueVue>
		</view>
		
		
		<view class="statusSet">
			<!-- 选择属性值类型 -->
			<uni-data-select 
				:clear="false"
				class="valueType" 
				v-model="newStatus.valueType"
				:localdata="valueTypes">
			</uni-data-select>
			<view class="button" @click="switchSetting">设置</view>
			<view class="button" @click="createTypeStatus">新建</view>
		</view>
		<!-- 额外输入栏 -->
		<component :is="statusBonusInputList[newStatus.valueType]"></component>
		<!-- 属性设置栏 -->
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
import { provide, reactive, ref, toRaw, watch } from 'vue'; 
import { statusSettingList, statusValueTypeList } from '@/data/list/statusValueList';
import settingBoxOptionVue from '../settingBoxOption.vue';
import statusValueVue from '@/components/popUps/all-exitence/statusValue/statusValue';
import { statusBonusInputList } from '@/data/list/statusBonusInputList';
import midTextAreaVue from '../../../other/midTextArea.vue';

// 新增属性
	let newStatus = reactive({
		name:"",
		value:null,
		valueType:"downLine",
		setting:{},
	})
	provide("status",newStatus)
// 选择属性类型
	let valueTypes = statusValueTypeList
	//切换属性类型时，清空setting和value
	function changeValueType(){
		newStatus.setting = {}
		newStatus.value = null
	}
	watch(()=> newStatus.valueType ,()=>{
		changeValueType()
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
	watch(()=> newStatus.valueType ,()=>{
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
		if(newStatus.name == ""){
			uni.showToast({
				title:"属性名不能为空",
				icon:"none"
			})
			return false
		}
		
		// 将当前分类属性的数据传递回创建分类组件，形成新的属性
		const newTypeStatus = JSON.parse(JSON.stringify(toRaw(newStatus)))
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
			min-height: 40rpx;
			width: 100%;
			.statusName{
				display: flex;
				width: 180rpx;
				box-sizing: border-box;
			}
			.statusValue{
				width: calc(100% - 190rpx);
			}
		}
		.statusSet{
			display: flex;
			align-items: center;
			height: 80rpx;
			.valueType{
				width: calc(100% - 400rpx);
				height: 80rpx;
			}
			.button{
				box-sizing: border-box;
				margin-left: 10rpx;
				width: 20%;
				height: 60rpx;
				border:3rpx solid black;
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