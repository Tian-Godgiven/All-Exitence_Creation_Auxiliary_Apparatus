<template>
<div class="editStatus">
	<div class="status">
		<StatusName :status :fullStatus/>
		<StatusValue :status :fullStatus/>
	</div>
	
	<!-- 属性类型与设置 -->
	<div class="statusSet">
		<Selector
			@change="changeValueType"
			class="selectValueType" 
			v-model="status.valueType"
			placeholder="选择类型"
			:list="valueTypeList">
		</Selector>

		<Button class="button" @click="switchSetting" name="设置"></Button>
		<Button class="button" @click="clickConfirm" :name="confirmText"></Button>
	</div>

	<!-- 额外输入栏 -->
	<StatusBonus :status :fullStatus></StatusBonus>
	<!-- 属性设置栏 -->
	<settingBoxVue ref="settingBox" :show="showSettingBox"/>
	
</div>
</template>

<script setup lang="ts" name="" generic="S extends (Status|ExitenceStatus)"> 
	import { ref, computed, provide, reactive, toRaw, Reactive } from 'vue'; 
	import { statusValueTypeList } from '@/static/list/statusValueList';
	import settingBoxVue from '../setting/settingBox.vue';
	import { getStatusSetting } from "@/static/list/settingList/status/statusSettingList";
	import StatusValue from './StatusValue.vue';
	import StatusName from './StatusName.vue';
	import { showQuickInfo } from '@/api/showQuickInfo';
	import { cloneDeep } from 'lodash';
	import Button from '@/components/global/Button.vue';
import Selector from '@/components/global/Selector.vue';
import Status from '@/interfaces/Status';
import StatusBonus from './StatusBonus.vue';
import { ExitenceStatus } from '@/class/Exitence';
import { createNewEmptyStatus, getFullStatus } from '@/hooks/all-exitence/status';

	const {confirm,confirmText,banValueType,status:oldStatus,typeStatus} = defineProps<{
		confirm:(newStatus:S)=>void,
		confirmText:string,
		banValueType?:string[],
		status?:S,
		typeStatus:Status
	}>()

	// 在接受了属性对象后，会创造一个属性对象的拷贝
	// 所有的修改都基于这个拷贝
	// 并在confirm中回传到父组件
	let status:Reactive<S>
	if(oldStatus){
		status = reactive(cloneDeep(oldStatus))
	}
	else{
		const newStatus = createNewEmptyStatus()
		status = reactive(newStatus as S)
	}

	//完整属性
	const fullStatus = getFullStatus(status,typeStatus)
    
	// 选择属性类型
	let valueTypeList = statusValueTypeList
	if(banValueType){
		valueTypeList = valueTypeList.reduce((acc,cur)=>{
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
		settingValue:{...fullStatus.value.setting},
		optionList:getStatusSetting(fullStatus.value.valueType)
	}
	provide("settingProps",settingProps)
	// 控制显示
	let showSettingBox = ref(false) 
	function switchSetting(){
		showSettingBox.value = !showSettingBox.value
	}
	
	//确认编辑内容
    const emit = defineEmits(["confirm"])
    function clickConfirm(){
		console.log(fullStatus.value.name.trim())
        // 要求name不能为空
		if(fullStatus.value.name.trim() == ""){
			showQuickInfo("属性名不能为空")
			return false
		}
		// 要求属性设置合理
		if(!settingBox.value.checkSet()){
			showQuickInfo("属性设置不正确")
			return false
		}
		const tmp = toRaw(status) as S
        confirm(tmp)
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
	.status{
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