<template>
	<!-- 用于创建不同type的设置项 -->
	<div class="setOption" :class="type">
		<div class="text">{{setOption.text}}</div>
		 
		<!-- checkBox类型 -->
		<div class="inner" v-if="type == 'checkBox'">
			<input v-model="setValue" @change="setTarget"  type="checkbox"/>
		</div>

		<!-- 输入框式 -->
		<div class="inner" v-else-if="type == 'input'">
			<!-- 复数输入框 -->
			<div class="multiInput" v-if="setOption.inputs" v-for="(inputText,index) in setOption.inputs"  >
				<div class="inputText">{{inputText}}</div>
				<downLineInputVue @blur="setTarget" v-model="setValue[index]"/>
			</div>
			<!-- 单个输入框 -->
			<downLineInputVue v-else @blur="setTarget" v-model="setValue"/>
		</div>

		<!-- 选项式 -->
		<div class="inner" v-else-if="type == 'choose'">
			<ElSelect
				@change="setTarget"
				v-model="setValue">
				<ElOption
					v-for="item in choices"
					:label="item.text"
					:value="item.value"
				></ElOption>
			</ElSelect>
		</div>
	</div>
</template>

<script setup lang="ts" name="">
import { ElOption, ElSelect } from 'element-plus';
import { computed, ref, toRaw, watch } from 'vue'; 
import downLineInputVue from '@/components/other/input/downLineInput.vue';

	//暴露一个方法用以调用确认值函数
	defineExpose({
		"confirmValue":confirmValue
	})

	//该设置项和设置目标
	let {setOption,target,settingValue} = defineProps(["setOption","target","settingValue"])
	//设置项类型
	const type = computed(()=>{
		return setOption.type
	})

	//绑定到组件上的动态值
	let setValue = ref()
	//设置其初始值，优先顺序为：
	//给出的setting中该设置项的值 → 设置项的默认值 → null
	//由于切换属性类型时，并不会重新创建设置项，因此需要监听设置项的变化从而重置绑定值
	watch(()=>setOption,()=>{
		//如果已有设置项
		if(settingValue[setOption.name]){
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
				setValue.value = []
			}
			else{
				setValue.value = ""
			}
		}
		else if(setOption.type == "choose"){
			setValue.value = null
		}
	},{
		immediate:true
	})
	
	//将用户设置的值传入target的设置中
	function setTarget(){
		// 不会修改属性中并不存在的设置项
		if(!settingValue[setOption.name] && setValue.value == null){
			return false
		}
		// 也不会在并没有修改设置值时，为其添加默认值
		// 也就是说此时还没有添加这个设置值，并且也没有实际上地设置这个设置值
		// 再简单点说：如果只是点了一下输入框，但没有改变输入内容时，不会将默认的值设置上去
		if(target["setting"][setOption.name]==null && toRaw(setValue.value) == setOption.value){
			return false
		}
		//防呆
		if(!target.setting){
			target.setting = {}
		}
		target["setting"][setOption.name] = setValue.value
	}

	// 确认该设置项的值是否符合要求
	function confirmValue(){
		const tmp = setOption.confirmValue
		if(!tmp || tmp(setValue.value)){
			return true
		}
		return false
	}

	//choose选择类型的选项
	let choices = computed(()=>{
		const tmp = setOption.choices
		if(tmp){
			return tmp
		}
		//不设置选项的情况，将使用setting中可能存在的选项
		else{
			return target.setting?.choices
		}
	})
</script>

<style lang="scss" scoped>
	.setOption{
		width: 100%;
		display: flex;
		padding: 5px 0;
		.text{
			text-wrap: nowrap;
		}
		.inner{
			flex-wrap: nowrap;
		}
	}
	// 输入框类型
	.input{
		.inner{
			.multiInput{
				display: flex;
				.inputText{
					flex-shrink: 0;
				}
			}
		}
	}
	//选择类型
	.choose{
		.inner{
			min-width: 200px;
			flex-grow: 0.9;
		}
	}
</style>