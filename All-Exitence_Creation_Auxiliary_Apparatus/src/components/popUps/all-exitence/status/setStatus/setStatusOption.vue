<template>
	<!-- 用于创建不同type的设置项 -->
	<div class="setOption" :class="type">
		<div class="text">{{setOption.text}}</div>
		 
		<!-- checkBox类型 -->
		<div class="inner" v-if="type == 'checkBox'">
			<input v-model="setValue" @change="setStatus"  type="checkbox"/>
		</div>

		<!-- 输入框式 -->
		<div class="inner" v-else-if="type == 'input'">
			<!-- 复数输入框 -->
			<div class="multiInput" v-if="setOption.inputs" v-for="(inputText,index) in setOption.inputs"  >
				<div class="inputText">{{inputText}}</div>
				<downLineInputVue @blur="setStatus" v-model="setValue[index]"/>
			</div>
			<!-- 单个输入框 -->
			<downLineInputVue v-else @blur="setStatus" v-model="setValue"/>
		</div>

		<!-- 选项式 -->
		<div class="inner" v-else-if="type == 'choose'">
			<ElSelect
				@change="setStatus"
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
import { computed, inject, ref, watch } from 'vue'; 
import downLineInputVue from '@/components/other/input/downLineInput.vue';
	defineExpose({
		"confirmValue":confirmValue
	})

	//该设置项
	let {setOption} = defineProps(["setOption"])
	//设置项类型
	const type = computed(()=>{
		return setOption.type
	})

	//属性对象
	const status = inject<any>("status")

	//可选选项
	let choices = computed(()=>{
		const tmp = setOption.choices
		if(tmp){
			return tmp
		}
		//不设置选项的去情况，将使用status本身的选项
		else{
			return status.setting.choices
		}
	})

	//绑定到组件上的动态值
	let setValue = ref()
	//设置项的初始值优先为属性中的该设置项的值，否则为默认值,无默认值的情况下，默认为空
	//由于切换属性类型时，并不会重新创建设置项，因此需要监听设置项的变化从而重置绑定值
	watch(()=>setOption,()=>{
		//如果属性内部已有相关设置
		if(status.setting[setOption.name]){
			setValue.value = status.setting[setOption.name]
		}
		//否则使用设置项内的默认值,并将其同步到属性内部
		else if(setOption.value){
			setValue.value = setOption.value
			setStatus()
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
	
	

	//将用户设置的值传入status的相应设置中
	function setStatus(){
		//不会对空内容进行设置
		if(!status.setting[setOption.name] && setValue.value == ""){
			return false
		}
		status.setting[setOption.name] = setValue.value
	}

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