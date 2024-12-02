<template>
	<!-- 用于创建不同class的设置面板的对象，根据其class选择切换显示 -->
	<div>
		<div class="setOption turnOn" v-if="type == 'turnOn'">
			<div class="text">{{setOption.text}}</div>
			<div class="inner">
				<input type="checkbox"/>
			</div>
		</div>
		<div class="setOption input" v-if="type == 'input'">
			<div class="text">{{setOption.text}}</div>
			<div class="inner" v-for="(input,index) in inputs">
				<div>{{input}}</div>
				<input/>
			</div>
		</div>
		<div class="setOption choose" v-if="type == 'choose'">
			<div class="text">{{setOption.text}}</div>
			<div class="inner">
				<ElSelect
					v-model="chosen"
				>
					<ElOption
						v-for="item in choice"
						:key="item.value"
						:label="item.value"
						:value="item.value"
					></ElOption>
				</ElSelect>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="">
import { ElOption, ElSelect } from 'element-plus';
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