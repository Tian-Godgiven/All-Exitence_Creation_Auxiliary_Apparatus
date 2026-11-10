<template>
<div class="editStatus" :class="{inline}">
	<div v-if="inline && $slots.header" class="statusHeader">
		<slot name="header"></slot>
		<Button v-if="showSettingButton" class="settingButton" icon="setting" @click="switchSetting"></Button>
	</div>
	<StatusEditorLayout v-if="inline" :confirmText @confirm="clickConfirm">
		<template #name><StatusName :status :fullStatus/></template>
		<template #value><StatusValue :target :status :fullStatus/></template>
		<template #type>
			<Selector v-model="valueType" placeholder="选择类型" :list="valueTypeList"/>
		</template>
	</StatusEditorLayout>
	<template v-else>
	<div class="status">
		<StatusName :status :fullStatus/>
		<StatusValue class="statusValue" :target :status :fullStatus/>
	</div>
	
	<!-- 属性类型与设置 -->
	<div class="statusSet">
		<Selector
			class="selectValueType" 
			v-model="valueType"
			placeholder="选择类型"
			:list="valueTypeList">
		</Selector>

		<Button class="button" bordered @click="switchSetting" name="设置"></Button>
		<Button class="button" bordered @click="clickConfirm" :name="confirmText"></Button>
	</div>
	</template>

	<!-- 额外输入栏 -->
	<StatusBonus :status :fullStatus :target></StatusBonus>
	<!-- 属性设置栏 -->
	<settingBoxVue ref="settingBox" 
		:target="settingTarget"
		:select-target="fullStatus"
		:defaultSetting="fullStatus.setting"
		:optionList="setOptionList"
		:show="showSettingBox"/>
	
</div>
</template>

<script setup lang="ts" name="" generic="S extends Status | ExitenceStatus"> 
	import { ref, computed, reactive, toRaw, Reactive } from 'vue'; 
	import { statusValueTypeList } from '@/static/list/statusValueList';
	import settingBoxVue from '../setting/settingBox.vue';
	import { getStatusSetting } from "@/static/list/settingList/status/statusSettingList";
	import StatusValue from './StatusValue.vue';
	import StatusName from './statusName.vue';
	import StatusEditorLayout from './StatusEditorLayout.vue';
	import { showQuickInfo } from '@/api/showQuickInfo';
	import { cloneDeep } from 'lodash';
	import Button from '@/components/global/button.vue';
	import Selector from '@/components/global/Selector.vue';
	import Status from '@/interfaces/Status';
	import StatusBonus from './StatusBonus.vue';
	import { Exitence, ExitenceStatus } from '@/class/Exitence';
	import { createNewEmptyStatus, getFullStatus } from '@/hooks/all-exitence/status';
import { Type } from '@/class/Type';

	const {confirm,
		confirmText,
		banValueType,
		inline=false,
		showSettingButton=true,
		target,
		status:oldStatus,
		fullStatus:oldFullStatus
	} = defineProps<{
		banValueType?:string[],
		inline?:boolean,
		showSettingButton?:boolean,
		status?:S,
		target:Exitence|Type
		fullStatus:Status
		confirmText:string,
		confirm:(newStatus:S)=>void,
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

	//以这个新的对象为例构建一个新的fullStatus
	const fullStatus = getFullStatus(status,oldFullStatus)
	const settingTarget = status as unknown as Status
    
	// 选择属性类型
	let valueTypeList = statusValueTypeList
	if(banValueType){
		valueTypeList = valueTypeList.flatMap((item)=>{
			if(!banValueType.includes(item.value)){
				return item
			}
			return []
		})
	}
	const valueType = computed({
		// 优先使用 status.value，为空时使用 fullStatus.value
		get:() => {
			return status.valueType || fullStatus.value.valueType
		},
		//更新时会清空其值和设置
		set: (newValueType) => {
			status.setting = {}
			status.value = null
			status.valueType = newValueType
		}
	})

	// 属性设置箱vue
	const settingBox = ref()
	const setOptionList = computed(()=>{
		return getStatusSetting(fullStatus.value.valueType)
	})
	// 控制显示
	let showSettingBox = ref(false) 
	function switchSetting(){
		showSettingBox.value = !showSettingBox.value
	}
	defineExpose({switchSetting})
	
	//确认编辑内容
    const emit = defineEmits(["confirm"])
    function clickConfirm(){
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
			flex: 1 1 0;
			width: auto;
			min-width: 0;
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
		}
	}
	.statusHeader{
		min-height: 42px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-weight: 600;
		.settingButton{ width: 34px; height: 34px; padding: 6px; }
	}
	
}

@media (min-width: 900px){
	.editStatus .statusSet{
		gap: 8px;
		.selectValueType{
			flex: 1 1 auto;
			width: auto;
			min-width: 0;
		}
		.button{
			flex: 0 0 auto;
			width: auto;
			min-width: 72px;
			height: 34px;
			margin-left: 0;
			padding: 0 12px;
		}
	}
}

	
	
</style>
