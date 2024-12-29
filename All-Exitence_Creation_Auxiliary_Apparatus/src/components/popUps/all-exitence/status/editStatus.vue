<template>
	<div class="editStatus">
		<div class="statusInfo">
			<!-- 属性名 -->
			<div class="statusName">
				<textAreaVue
					mode="string"
					v-model="status.name"
					placeholder="属性名"/>
			</div>
			<div class="separator">：</div>

			<!-- 属性值 -->
			<statusValueVue class="statusValue"></statusValueVue>
		</div>
		
		<!-- 属性类型与设置 -->
		<div class="statusSet">
			<ElSelect
				@change="changeValueType"
				class="selectValueType" 
				v-model="status.valueType"
				placeholder="Select">
				<ElOption
					v-for="item in valueTypes"
					:key="item.value"
					:label="item.text"
					:value="item.value"
				/>
			</ElSelect>
			<div class="button" @click="switchSetting">设置</div>
            <div class="button" @click="confirm">
                <slot name="confirm"></slot>
            </div>
		</div>

		<!-- 额外输入栏 -->
		<component :is="statusBonusInputList[status.valueType]"></component>

		<!-- 属性设置栏 -->
		<setStatusVue ref="setStatus" :show="showSetStatus"></setStatusVue>
		
	</div>
</template>

<script setup lang="ts" name=""> 
	import { inject, ref} from 'vue'; 
	import { statusValueTypeList } from '@/data/list/statusValueList';
	import setStatusVue from "@/components/popUps/all-exitence/status/setStatus/setStatus.vue"
	import statusValueVue from '../status/statusValue/statusValue.vue';
	import { statusBonusInputList } from '@/data/list/statusBonusInputList';
	import textAreaVue from '@/components/other/textArea/textArea.vue';
	import { showQuickInfo } from '@/api/showQuickInfo';
	import { ElOption, ElSelect } from 'element-plus';
	import { cloneDeep } from 'lodash';

	// 需要编辑的属性初值
    let status = inject<any>("status")
    let typeStatus = inject<any>("typeStatus")
    if(!status.name){
        status.name = cloneDeep(typeStatus.name);
    }
    if(!status.valueType){
        status.valueType = cloneDeep(typeStatus.valueType)
    }
    
	// 选择属性类型
	let valueTypes = statusValueTypeList
	// 去除禁用属性
	const {banValueType} = defineProps(["banValueType"])
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

	// 属性设置
	const setStatus = ref()
	// 控制显示
	let showSetStatus = ref(false) 
	function switchSetting(){
		showSetStatus.value = !showSetStatus.value
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
		if(!setStatus.value.checkSet()){
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
			.statusName{
				width: calc(150px - 1rem);
				box-sizing: border-box;
			}
			.separator{
				min-width: 1rem;
			}
			.statusValue{
				width: calc(100% - 150px);
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