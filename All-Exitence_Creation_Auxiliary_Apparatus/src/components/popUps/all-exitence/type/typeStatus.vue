<template>
	<div  class="status">
		<!-- 属性名 -->
		<div class="name">
			<midTextAreaVue
				v-model="status['name']"
				placeholder="属性名">
			</midTextAreaVue>
			<div>：</div>
		</div>
		<!-- 属性值 -->
		<statusValueVue class="value"></statusValueVue>
		<div class="buttons">
			<div class="button">编辑</div>
			<div class="button" @click="deleteStatus">删除</div>
		</div>
		<div class="statusSetting"></div>
	</div>
</template>

<script setup lang="ts" name="typeStatus">
import { provide } from 'vue';
import statusValueVue from '../status/statusValue/statusValue.vue';
import midTextAreaVue from '../../../other/midTextArea.vue';
	let model = defineModel()
	let emits = defineEmits(["deleteStatus"])
	let status = model.value
	provide("status",status)
	function deleteStatus(){
		emits('deleteStatus')
	}
</script>

<style lang="scss" scoped>
	.status{
		display: flex;
		.name{
			display: flex; 
			width: 200px;
			box-sizing: border-box;
		}
		.value{
			width: calc(100% - 200px);
		}
		.buttons{
			.button{
				height: 30px;
				width: 30px;
				padding:5px;
				overflow: hidden;
			}
		}
	}
</style>