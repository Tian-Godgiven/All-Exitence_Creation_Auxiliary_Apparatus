<template>
<div class="editType">
	<div class="top">
		<downLineInputVue 
			v-model="name"
			class="typeName"
			placeholder="输入分类名称"/>
		<Button class="button" name="预制属性" @click="prepareStatus"></Button>
	</div>

	<div class="inner">
		<SwitchExpand>
			<template #title @click="switchExpand">分类属性</template>
			<template #inner>
				<draggableListVue 
					:drag-handle="true"
					:list="typeStatus" 
					v-slot="{item:status}">
					<TypeStatus 
						@deleteStatus="deleteStatus(status)" 
						:key="status.__key"
						:status="status">
					</TypeStatus>
				</draggableListVue>
				<NewTypeStatus :createStatus="addStatus"/>
			</template>
		</SwitchExpand>
		
		<SwitchExpand :start-expand="false">
			<template #title @click="switchSetting">分类设置</template>
			<template #inner>
				<settingBoxVue ref="settingBox"></settingBoxVue>
			</template>
		</SwitchExpand>
	</div>

	<FinalButtons :buttons="[
		{click:confirm,name:'确认'},
		{click:()=>closePopUp(popUp),name:'取消'}]">
	</FinalButtons>
</div>
</template>

<script setup lang="ts" name="">
import { provide, reactive, ref, toRaw } from 'vue'; 
import downLineInputVue from '@/components/other/input/downLineInput.vue';
import draggableListVue from '@/components/other/DraggableList.vue';
import NewTypeStatus from './NewTypeStatus.vue';
import TypeStatus from './TypeStatus.vue';
import { closePopUp } from '@/hooks/pages/popUp';
import { checkTypeNameRepeat } from '@/hooks/all-exitence/allExitence';
import { showQuickInfo } from '@/api/showQuickInfo';
import { cloneDeep } from 'lodash';
import Button from '@/components/global/Button.vue';
import settingBoxVue from '@/components/all-exitence/setting/settingBox.vue';
import { typeSettingList } from '@/static/list/settingList/typeSettingList';
import { nanoid } from 'nanoid';
import { Type } from '@/class/Type';
import Status from '@/interfaces/Status';
import FinalButtons from '@/app/stacks/popUp/FinalButtons.vue';
import SwitchExpand from '@/components/other/SwitchExpand.vue';
	const {props={},popUp,returnValue} = defineProps(["props","popUp","returnValue"])
    let {type} = props

	//type存在则创建深拷贝，不存在则创建空type
	const tmpType:Type = type? reactive(cloneDeep(type)) : reactive({
		name:"",
		typeStatus:reactive([]),
		setting:reactive({})
	})
	
	const {typeStatus,setting} = tmpType
	const name = ref(tmpType.name)
	
	//分类的所有属性
	provide("allStatus",typeStatus)
	provide("allTypeStatus",typeStatus)
	
	//显示预制属性弹窗
	function prepareStatus(){

	}
	//向分类中添加指定的属性，给予key标识符
	function addStatus(newStatus:Status){		
		//给予key标识符
		newStatus.__key = nanoid()
		typeStatus.push(newStatus)
	}
	//删除对应的属性
	function deleteStatus(status:Status){
		const index = typeStatus.indexOf(status)
		typeStatus.splice(index,1)
	}

	//分类设置
    const typeSetting = {
        target:tmpType,//实际上修改的是事物对象的setting
        optionList:typeSettingList,
        settingValue:tmpType.setting
    }
    provide("settingProps",typeSetting)
	const settingBox = ref()

	//确认创建分类
	function confirm(){
		//分类名称不可为空
		if(name.value == "" || !name.value){
			showQuickInfo("分类名不可为空")
			return false
		}
		const tmp = checkTypeNameRepeat(name.value,type)
		if(tmp){
			showQuickInfo("分类名不可重复")
			return false
		}
		// 要求设置合理
		if(!settingBox.value.checkSet()){
			showQuickInfo("分类设置不正确")
			return false
		}
        returnValue(name.value,toRaw(typeStatus),toRaw(setting))
		//关闭弹窗
		closePopUp(popUp)
	}
</script>

<style lang="scss" scoped>
@use "@/static/style/components/inputs.scss";
.editType{
	height: 100%;
	width: 100%;
}
.top{
	display: flex;
	height: 100px;
	position: relative;
	.typeName{
		position: relative;
		top:-20px;
		margin-top:auto;
		font-size: 1.4rem;
		width: 550px;
		height: 60px;
	}
	.button{
		height: 80px;
		width: 80px;
		border: 3px solid black;
		margin: 10px
	}
}
.inner{
	width: 100%;
	overflow: auto;
	scrollbar-width: none;
	max-height: calc(100% - 200px);
	.setting{
		width: 100%;
		.button{
			width: 30%;
			display: flex;
			align-items: center;
			justify-content: center;
			border: 3px solid black;
			padding: 5px;
		}
	}
}
</style>