<template>
	<!-- 用于创建不同class的设置面板的对象，根据其class选择切换显示 -->
	<view>
		<view class="setOption turnOn" v-if="type == 'turnOn'">
			<view class="text">{{setOption.text}}</view>
			<view class="inner">
				<input type="checkbox"/>
			</view>
		</view>
		<view class="setOption input" v-if="type == 'input'">
			<view class="text">{{setOption.text}}</view>
			<view class="inner" v-for="(input,index) in inputs">
				<view>{{input}}</view>
				<input/>
			</view>
		</view>
		<view class="setOption choose" v-if="type == 'choose'">
			<view class="text">{{setOption.text}}</view>
			<view class="inner">
				<uni-data-select
					v-model="chosen"
					:clear="false"
					:localdata="choice"
				></uni-data-select>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts" name="">
import { inject, ref } from 'vue'; 
	let {setOption} = defineProps(["setOption"])
	const status = inject("status")
	let type = setOption.type
	let value = ref()
	let inputs = ref([])
	let chosen = ref()
	let choice = ref([])
	if(type == "input"){
		inputs.value = setOption.inputs
	}
	function confirmValue(){
		return true
	}
</script>

<style lang="scss" scoped>
	.setOption{
		display: flex;
		
	}
	.input{
		.inner{
			display: flex;
		}
	}
</style>