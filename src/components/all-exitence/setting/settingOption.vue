<template>
<!-- 用于创建不同type的设置项 -->
<div class="setOption" :class="setOption.type">

	<div cla ss="text">{{setOption.text}}</div>

	<div class="checkBoxOption inner"
		v-if="setOption.type == 'checkBox'">
		<input v-model="setValue" @change="setTarget" type="checkbox"/>
	</div>

	<div class="chooseOption inner" 
		v-else-if="setOption.type == 'choose'">
		<Selector 
			class="selector inner"
			placeholder="请选择"
			@change="setTarget"
			v-model="setValue"
			:list="choices">
		</Selector>
	</div>

	<div class="inputOption"
		v-else-if="setOption.type == 'input'">
		<!-- 复数输入框 -->
		<div class="multiInput" 
			v-if="setOption.inputs && isArray(setValue)" 
			v-for="(inputText,index) in setOption.inputs">
			<div class="inputText">{{inputText}}</div>
			<DownLineInput @blur="setTarget" v-model="setValue[index]"/>
		</div>
		<!-- 单个输入框 -->
		<DownLineInput v-else @blur="setTarget" v-model="(setValue as string)"/>
	</div>
</div>
</template>

<script setup lang="ts" generic="T extends SettingTarget,S">
import { computed, ref, toRaw, watch } from 'vue'; 
import { SettingOption, SettingTarget } from './setting';
import { isArray } from 'lodash';
import Selector from '@/components/global/Selector.vue';
import DownLineInput from '@/components/other/input/downLineInput.vue';

	//暴露一个方法用以调用确认值函数
	defineExpose({
		"confirmValue":confirmValue
	})

	//该设置项和设置目标
	const {target,defaultSetting,setOption,chooseTarget} = defineProps<{
		target:T,
		setOption:SettingOption<T,S>,
		defaultSetting?:Record<string,any>,
		chooseTarget?:any[]
	}>()

	//设置值，在无默认值的情况下，使用目标的设置属性值
	let settingValue = defaultSetting ?? target.setting ?? {}

	let beginValue:any
	//绑定到组件上的动态值
	let setValue = ref<(typeof setOption.value)|null>()
	//设置其初始值，优先顺序为：
	//给出的setting中该设置项的值 → 设置项的默认值 → null
	//由于切换属性类型时，并不会重新创建设置项，因此需要监听设置项的变化从而重置绑定值
	watch(()=>setOption,()=>{
		//如果默认值包含已有设置项
		if(setOption.name in settingValue){
			setValue.value = settingValue[setOption.name]
		}
		//否则使用设置项内的默认值
		else if(setOption.value){
			setValue.value = setOption.value
		}
		//否则根据类型使用不同的空值
		else if(setOption.type == "checkBox"){
			setValue.value = false
		}
		else if(setOption.type == "input"){
			//如果存在inputs，则为多项输入框
			if(setOption.inputs){
				setValue.value = new Array(setOption.inputs.length).fill("")
			}
			else{
				setValue.value = ""
			}
		}
		else if(setOption.type == "choose"){
			setValue.value = ""
		}
		//使用初始值进行一次change
		if(setOption.change){
			setOption.change(null,setValue.value,target)
		}
		//设置初始值
		beginValue = toRaw(setValue.value)
	},{
		immediate:true
	})

	//设置的旧值
	let oldValue = setValue.value

	//测试：这东西有用吗？ //同时还会监听target的设置值的外界变化
	// watch(()=>target.setting,()=>{
	// 	const value = target.setting[setOption.name]
	// 	if(value && value != setValue.value){
	// 		setValue.value = value
	// 	}
	// },{
	// 	deep:true,
	// })

	// 断言函数
	function ensureSetting(target: T): asserts target is T & { setting: Record<string, any> } {
		if (!("setting" in target)) {
			Object.assign(target, { setting: {} });
		}
	}
	
	//将用户设置的值传入target的设置中
	function setTarget(){
		console.log("新的设置值",target,setOption,setValue.value)
		//进行设置就必须要有setting
		ensureSetting(target)
		// 不会尝试修改属性中并不存在且默认值中也没有的设置项
		if(!settingValue[setOption.name] && setValue.value == null){
			return false
		}
		// 如果没有改变输入值，并且目标内部不具备该设置，不会将默认的值设置上去
		if(target["setting"][setOption.name] == null && setValue.value == beginValue){
			return false
		}

		target["setting"][setOption.name] = setValue.value
		//触发该设置的改变事件
		if(setOption.change){
			setOption.change(oldValue,setValue.value,target)
		}
		oldValue = setValue.value
	}

	//choose选择类型所使用的选项
	const choices = computed<{label:string,value:string}[]>(()=>{
		if(setOption.type !== "choose")return [{label:"无",value:""}]
		//优先使用定义的选项数组
		const tmp = setOption.choices
		if(isArray(tmp)){
			return tmp
		}
		//否则使用其执行的结果
		else{
			let tmpList = []
			//防呆
			if(!isArray(chooseTarget)){
				tmpList = tmp(target,chooseTarget)
			}
			else{
				tmpList = tmp(target,...chooseTarget)
			}
			//如果这个设置项没有默认值，则会在开头添加一个空值选项
			if(setOption.value == null){
				tmpList.unshift({label:"无",value:""})
			}
			return tmpList
		}
	})

	// 确认该设置项的值是否符合要求
	function confirmValue(){
		const tmp = setOption.confirmValue
		if(!tmp || tmp(setValue.value)){
			return true
		}
		return false
	}
</script>

<style lang="scss" scoped>
.setOption{
	width: 100%;
	display: flex;
	padding: 10px 0;
	.text{
		flex-shrink: 0;
		line-height: 100%;
		max-width: 50%;
		text-wrap: wrap;
	}
	.inner{
		flex-shrink: 0;
		flex-grow: 1;
		min-width: 50%;
		flex-wrap: nowrap;
	}
}
.chooseOption{
	.selector{
		width: 100%;
	}
}
// 输入框类型
.inputOption{
	.inner{
		margin-top: auto;
		.multiInput{
			display: flex;
			.inputText{
				line-height: 100%;
				flex-shrink: 0;
			}
		}
	}
}
</style>