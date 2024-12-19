<template>
	<div class="newStatus">
		<div class="statusInfo">  
			<!-- 属性名 -->
			<div class="statusName">
				<textAreaVue
					v-model="newStatus.name"
					placeholder="属性名"/>
			</div>
			<div class="separator">：</div>
			<!-- 属性值 -->
			<statusValueVue class="statusValue"></statusValueVue>
		</div>
		
		
		<div class="statusSet">
			<!-- 选择属性值类型 -->
			<ElSelect
				@change="changeValueType"
				class="valueType" 
				v-model="newStatus.valueType"
				placeholder="Select">
				<ElOption
					v-for="item in valueTypes"
					:key="item.value"
					:label="item.text"
					:value="item.value"
				/>
			</ElSelect>
			<div class="button" @click="switchSetting">设置</div>
		</div>
		
		<!-- 额外输入栏 -->
		<component :is="statusBonusInputList[newStatus.valueType]"></component>
		
		<!-- 属性设置栏 -->
		<setStatusVue ref="setStatus" :show="showSetStatus"></setStatusVue>
		
		<div class="buttons">
			<div class="button" @click="confirm">确认</div>
			<div class="button" @click="closePopUp(popUp)">取消</div>
		</div>
		
		
	</div>
</template>

<script setup lang="ts" name=""> 
	import { provide, reactive, ref, toRaw } from 'vue'; 
	import { statusValueTypeList } from '@/data/list/statusValueList';
	import statusValueVue from '@/components/popUps/all-exitence/status/statusValue/statusValue.vue';
	import { statusBonusInputList } from '@/data/list/statusBonusInputList';
	import textAreaVue from '@/components/other/textArea/textArea.vue';
	import { closePopUp } from '@/hooks/popUp';
	import { ElOption, ElSelect } from 'element-plus';
	import { showQuickInfo } from '@/api/showQuickInfo';
	import Status from '@/interfaces/exitenceStatus';
	import setStatusVue from '@/components/popUps/all-exitence/status/setStatus/setStatus.vue';

	const {props,popUp,returnValue} = defineProps(["props","popUp","returnValue"])
// 新增属性对象
	let newStatus = reactive<Status>({
		name:"",
		value:null,
		valueType:"downLine",
		setting:{},
		__key:null
	})
	provide("status",newStatus)
	provide("typeStatus",newStatus)
// 选择属性类型
	let valueTypes = statusValueTypeList
	//去除禁用的属性类型
	const banValueType = props?.banValueType
	if(banValueType){
		valueTypes = valueTypes.reduce((acc,cur)=>{
			if(!banValueType.includes(cur.value)){
				acc.push(cur)
			}
			return acc
		},<any[]>[])
	}
	//切换属性类型时，清空setting和value
	function changeValueType(){
		newStatus.setting = {}
		newStatus.value = null
	}

// 属性设置
	const setStatus = ref()
	// 控制显示
	let showSetStatus = ref(false) 
	function switchSetting(){
		showSetStatus.value = !showSetStatus.value
	}
	
// 确认属性内容
	function confirm(){
		// 要求name不能为空
		if(newStatus.name == ""){
			showQuickInfo("属性名不能为空")
			return false
		}
		// 要求属性设置合理
		if(!setStatus.value.checkSet()){
			return false
		}
		
		// 将这个属性的数据传回去
		returnValue(toRaw(newStatus))
		closePopUp(popUp)
	}
	
	
</script>

<style lang="scss" scoped>
@use "@/static/style/components/inputs.scss";
@use "@/static/style/components/popUpButtons.scss";
	.newStatus{
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		padding: 10px 20px;
		.statusInfo{
			display: flex;
			min-height: 40px;
			width: 100%;
			.statusName{
				display: flex;
				width: 180px;
				box-sizing: border-box;
			}
			.statusValue{
				width: calc(100% - 190px);
			}
		}
		.statusSet{
			display: flex;
			align-items: center;
			height: 80px;
			.valueType{
				width: calc(100% - 400px);
				height: 80px;
			}
			.button{
				box-sizing: border-box;
				margin-left: 10px;
				width: 20%;
				height: 60px;
				border:3px solid black;
			}
		}
		
		.settingBox{
			max-height: 0px;
			width: 100%;
			overflow: hidden;
			transition: max-height 450ms ease-in-out;
		}
		.settingBox-show{
			max-height: 300px;
		}
		.buttons{
			@extend .buttons
		}
	}
	
	
</style>