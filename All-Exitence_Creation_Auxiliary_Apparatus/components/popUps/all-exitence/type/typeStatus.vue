<template>
	<view  class="status">
		<!-- 属性名 -->
		<view class="name">
			<midTextAreaVue
				v-model="status['name']"
				placeholder="属性名">
			</midTextAreaVue>
			<view>：</view>
		</view>
		<!-- 属性值 -->
		<statusValueVue class="value"></statusValueVue>
		<view class="buttons">
			<view class="button">编辑</view>
			<view class="button" @click="deleteStatus">删除</view>
		</view>
		<view class="statusSetting"></view>
	</view>
</template>

<script setup lang="ts" name="typeStatus">
import { provide } from 'vue';
import statusValueVue from '../statusValue/statusValue.vue';
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
			width: 200rpx;
			box-sizing: border-box;
		}
		.value{
			width: calc(100% - 200rpx);
		}
		.buttons{
			.button{
				height: 30rpx;
				width: 30rpx;
				padding:5rpx;
				overflow: hidden;
			}
		}
	}
</style>