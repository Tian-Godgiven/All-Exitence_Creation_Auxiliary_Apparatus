<template>
	<view class="popUp" :style="{
		zIndex:index,
		height:height,
		width:width
	}">
		<!-- 标题 -->
		<view class="titleName" v-if="name">{{ name }}</view>
		<!-- 按键 -->
		<view class="titleButtons" >
			<view v-for="(button,index) in buttons" 
				class="button" 
				:name="button.name" 
				@click="button.click"
			>
				<image v-if="button.icon" :src="button.icon" mode="aspectFill"></image>
				<text v-else>{{button.name}}</text>
			</view>
		</view>
		<view class="inner">
			<component :is="innerVue" 
				:popUp="popUp" 
				:returnValue="popUp?.returnValue"
				:props='popUp.props'>
			</component>
		</view>
	</view>
</template>

<script setup lang="ts" name="">
import { ref, shallowReactive, shallowRef } from 'vue';
import { PopUp } from '../../hooks/popUp'; 
import { popUpVueList } from '../../data/list/popUpVueList';
	let tmp = defineProps(["popUp"])
	let popUp:PopUp = tmp.popUp
	let {name,buttons,vueName,index} = popUp
	let innerVue = shallowRef()
	if(popUp.vue){
		innerVue = popUp.vue
	}
	else{
		innerVue = popUpVueList[vueName]
	}
	//尺寸
	let width = ref("650rpx")
	let height = ref("80%")
	if(popUp.size){
		if(popUp.size.width){
			width.value = popUp.size.width
		}
		if(popUp.size.height){
			height.value = popUp.size.height
		}
	}
	console.log(popUp)
</script>

<style lang="scss" scoped>
	@import "@/static/style/global.scss";
	.popUp{
		background-color: $bgColor;
		max-width: 650rpx;
		max-height: 80%;
		box-shadow: black 0rpx 0rpx 50rpx;
		position: absolute;
		left:50%;
		top:50%;
		transform: translate(-50%, -50%);
		padding: 50rpx 20rpx;
		box-sizing: border-box;
		border-radius: 2%;
		pointer-events: auto;
		overflow:auto;
			.titleName{
				position: relative;
				height: 70rpx;
				top: 0rpx;
				width: 300rpx;
				font-size: 60rpx;
				display: flex;
				align-items: center;
			}
			.titleButtons{
				height: 50rpx;
				position: absolute;
				right:0;
				top:0;
				width: 350rpx;
				display: flex;
				flex-direction: row-reverse;
			}
		
		.inner{
			height: calc(100% - 90rpx);
			width: 100%;
			box-sizing: border-box;
		}
	}
</style>