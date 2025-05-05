<template>
<div class="editStatus">
	<div class="statusInfo">
		<StatusName :status="status" :typeStatus="typeStatus"/>
		<StatusValue :status="status" :typeStatus="typeStatus"/>
	</div>
	
	<!-- 属性类型与设置 -->
	<div class="statusSet">
		<Selector
			@change="changeValueType"
			class="selectValueType" 
			v-model="status.valueType"
			placeholder="选择类型"
			:list="valueTypes">
		</Selector>

		<Button class="button" @click="switchSetting" name="设置"></Button>
		<Button class="button" @click="confirm" :name="confirmText"></Button>
	</div>

	<!-- 额外输入栏 -->
	<component :status="status" :is="statusBonusInputList[status.valueType]"></component>
	<!-- 属性设置栏 -->
	<settingBoxVue ref="settingBox" :show="showSettingBox"/>
	
</div>
</template>

<script setup lang="ts" name=""> 
	import { inject, ref, computed, provide } from 'vue'; 
	import { statusValueTypeList } from '@/static/list/statusValueList';
	import settingBoxVue from '../setting/settingBox.vue';
	import { getStatusSetting } from "@/static/list/settingList/statusSettingList";
	import StatusValue from './StatusValue.vue';
	import { statusBonusInputList } from '@/static/list/statusBonusInputList';
	import StatusName from './StatusName.vue';
	import { showQuickInfo } from '@/api/showQuickInfo';
	import { cloneDeep } from 'lodash';
	import Button from '@/components/global/Button.vue';
import Selector from '@/components/global/Selector.vue';
import Status from '@/interfaces/Status';
import { defaultStatus } from '@/hooks/all-exitence/status';

	const {confirmText,banValueType} = defineProps<{
		confirmText:string,
		banValueType?:string[]
	}>()
	
	// 需要编辑的属性初值
    let status = inject<Status>("status",cloneDeep(defaultStatus))
    let typeStatus = inject<any>("typeStatus")
    if(!status.name){
        status.name = cloneDeep(typeStatus.name);
    }
    if(!status.valueType){
        status.valueType = cloneDeep(typeStatus.valueType)
    }
    
	// 选择属性类型
	let valueTypes = statusValueTypeList
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
		status.setting = {}
		status.value = null
	}

	// 属性设置箱vue
	const settingBox = ref()
	//提供给设置项的变量检验的是与typeStatus整合后的结果
	const settingProps = {
		target:status,
		selectTarget:computed(()=>{
			return {...typeStatus,...status}
		}),
		settingValue:{...typeStatus.setting,...status.setting},
		optionList:getStatusSetting(status)
	}
	provide("settingProps",settingProps)
	// 控制显示
	let showSettingBox = ref(false) 
	function switchSetting(){
		showSettingBox.value = !showSettingBox.value
	}
	
	//确认编辑内容
    const emit = defineEmits(["confirm"])
    function confirm(){
        // 要求name不能为空
		if(status.name == ""){
			showQuickInfo("属性名不能为空")
			return false
		}
		// 要求属性设置合理
		if(!settingBox.value.checkSet()){
			showQuickInfo("属性设置不正确")
			return false
		}
        emit("confirm",status)
    }
	
</script>

<style lang="scss" scoped>
@use "@/static/style/components/inputs.scss";
.editStatus{
	border:2px dashed black;
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	padding: 10px 20px;
	.statusInfo{
		display: flex;
		min-height: 40px;
		width: 100%;
		.statusValue{
			width: calc(100% - 150px);
		}
		:deep(.statusName){
			width: 150px;
		}
	}
	.statusSet{
		display: flex;
		align-items: center;
		height: 80px;
		.selectValueType{
			width: calc(100% - 200px);
		}
		.button{
			box-sizing: border-box;
			margin-left: 10px;
			width: 20%;
			height: 60px;
			border:3px solid black;
		}
	}
	
}
	
	
</style>