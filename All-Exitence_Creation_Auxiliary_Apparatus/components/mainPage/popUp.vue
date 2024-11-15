<template>
	<view class="popUp" :style="{
		zIndex:index,
	}">
		<view class="titleBar">
			<view class="titleName">{{ name }}</view>
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
		</view>
		<view class="inner">
			<component :is="innerVue"></component>
		</view>
	</view>
</template>

<script setup lang="ts" name="">
import { ref, shallowRef } from 'vue';
import { closePopUp,PopUp } from '../../hooks/popUp'; 
import { popUpVueList } from '../../data/list/popUpVueList';
	let tmp = defineProps(["popUp"])
	let popUp:PopUp = tmp.popUp
	let {name,buttons,vueName,index} = popUp
	let innerVue = shallowRef(popUpVueList[vueName])
	// 默认具备关闭按键
	buttons.push({
		name:"关闭",
		click:()=>{
			closePopUp()
		}
	})

</script>

<style lang="scss" scoped>
	@import "@/static/style/global.scss";
	.popUp{
		background-color: $bgColor;
		width: 650rpx;
		height: 80%;
		box-shadow: black 0rpx 0rpx 50rpx;
		position: relative;
		left:50rpx;
		top:10%;
		border-radius: 2%;
		pointer-events: auto;
		.titleBar{
			height: 90rpx;
			width: 100%;
			display: flex;
			.titleName{
				width: 300rpx;
				font-size: 60rpx;
				display: flex;
				align-items: center;
				padding: 0 20rpx;
			}
			.titleButtons{
				width: 350rpx;
				display: flex;
				flex-direction: row-reverse;
			}
		}
		.inner{
			height: calc(100% - 90rpx);
			width: 100%;
			box-sizing: border-box;
			padding: 10rpx 20rpx;
		}
	}
</style>