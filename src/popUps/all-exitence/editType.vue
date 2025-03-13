<template>
	<div class="editType">
		<div class="top">
			<downLineInputVue 
				v-model="name"
				class="typeName"
				placeholder="输入分类名称"/>
			<div class="button" @click="prepareStatus">预制属性</div>
		</div>

		<!-- 内容 -->
		<div class="inner">
			<!-- 修改顺序 -->
			<draggableListVue 
				:drag-handle="true"
				:list="typeStatus" 
				v-slot="{element:status,index}">
				<typeStatusVue 
					@deleteStatus="deleteStatus(index)" 
					:key="status.__key"
					:status="status">
				</typeStatusVue>
			</draggableListVue>
			

			<!-- 创建新属性 -->
			<newTypeStatusVue 
				@createStatus="addStatus($event)">
			</newTypeStatusVue>

			<!-- 分类设置 -->
			<div class="setting">
				<div class="button" @click="showSettingBox = !showSettingBox">
					分类设置
				</div>
				<settingBoxVue ref="settingBox" :show="showSettingBox"></settingBoxVue>
			</div>
		</div>

		<!-- 确认按键 -->
		<div class="bottom">
			<div class="button" @click="confirm">确认</div>
			<div class="button" @click="closePopUp(popUp)">取消</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="">
import { provide, reactive, ref, toRaw } from 'vue'; 
import downLineInputVue from '@/components/other/input/downLineInput.vue';
import draggableListVue from '@/components/other/draggableList/draggableList.vue';
import typeStatusVue from '@/components/all-exitence/type/typeStatus.vue';
import newTypeStatusVue from '@/components/all-exitence/type/newTypeStatus.vue';
import { closePopUp } from '@/hooks/pages/popUp';
import { checkTypeNameRepeat } from '@/hooks/all-exitence/allExitence';
import { showQuickInfo } from '@/api/showQuickInfo';
import { cloneDeep } from 'lodash';
import settingBoxVue from '@/components/all-exitence/setting/settingBox.vue';
import { typeSettingList } from '@/static/list/settingList/typeSettingList';
import { nanoid } from 'nanoid';

	const {props={},popUp,returnValue} = defineProps(["props","popUp","returnValue"])
    let {type} = props

	//type存在则创建深拷贝，不存在则创建空type
	const tmpType = type? reactive(cloneDeep(type)) : reactive({
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
	function addStatus(newStatus:{[key:string]:any}){		
		//给予key标识符
		newStatus.__key = nanoid()
		typeStatus.push(newStatus)
	}
	//删除对应的属性
	function deleteStatus(index:number){
		typeStatus.splice(index,1)
	}

	//分类设置
    const settingProps = {
        target:tmpType,//实际上修改的是事物对象的setting
        optionList:typeSettingList,
        settingValue:tmpType.setting
    }
    provide("settingProps",settingProps)
	const settingBox = ref()
	//控制分类设置显示
	const showSettingBox = ref(false)

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
@use "@/static/style/popUp.scss";
	.editType{
		height: 100%;
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
	.bottom{
		@extend .finalButtons;
	}
</style>