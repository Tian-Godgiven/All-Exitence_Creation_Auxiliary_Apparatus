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
		
		<!-- 属性设置 -->
		<div class="statusSet">
			<!-- 选择属性值类型 -->
			<ElSelect
				@change="changeValueType"
				class="selectValueType" 
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
			<div class="button" @click="createTypeStatus">新建</div>
		</div>

		<!-- 额外输入栏 -->
		<component :is="statusBonusInputList[newStatus.valueType]"></component>

		<!-- 属性设置栏 -->
		<setStatusVue ref="setStatus" :show="showSetStatus"></setStatusVue>
		

		
	</div>
</template>

<script setup lang="ts" name=""> 
	import { provide, reactive, ref, toRaw } from 'vue'; 
	import { statusValueTypeList } from '@/data/list/statusValueList';
	import setStatusVue from "@/components/popUps/all-exitence/status/setStatus/setStatus.vue"
	import statusValueVue from '../status/statusValue/statusValue.vue';
	import { statusBonusInputList } from '@/data/list/statusBonusInputList';
	import textAreaVue from '@/components/other/textArea/textArea.vue';
	import Status from '@/interfaces/exitenceStatus';
	import { showQuickInfo } from '@/api/showQuickInfo';
	import { ElOption, ElSelect } from 'element-plus';

	// 新增属性
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
	
	
// 确认新增属性
	let emit = defineEmits(["createStatus"])
	function createTypeStatus(){
		// 要求name不能为空
		if(newStatus.name == ""){
			showQuickInfo("属性名不能为空")
			return false
		}
		// 要求属性设置合理
		if(!setStatus.value.checkSet()){
			showQuickInfo("属性设置不正确")
			return false
		}
		
		// 将当前分类属性的数据传递回创建分类组件，形成新的属性
		const newTypeStatus = JSON.parse(JSON.stringify(toRaw(newStatus)))
		emit("createStatus",newTypeStatus)
	}
	
	
</script>

<style lang="scss" scoped>
@use "@/static/style/components/inputs.scss";
	.newStatus{
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