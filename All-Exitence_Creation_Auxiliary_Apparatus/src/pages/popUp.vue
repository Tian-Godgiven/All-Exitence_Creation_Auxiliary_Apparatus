<template>
	<div class="popUp" :style="{
		zIndex:index,
		height:height,
		width:width
	}">
		<!-- 标题 -->
		<div class="titleName" v-if="name">{{ name }}</div>
		<div class="titleSpace" v-else></div>
		<!-- 按键 -->
		<div class="titleButtons" >
			<div v-for="(button) in buttons" 
				class="button" 
				:name="button.name" 
				@click="button.click"
			>
				<image v-if="button.icon" :src="button.icon" mode="aspectFill"></image>
				<text v-else>{{button.name}}</text>
			</div>
		</div>
		<div class="inner">
			<component :is="innerVue" 
				:popUp="popUp" 
				:returnValue="popUp?.returnValue"
				:props='popUp.props'>
			</component>
		</div>
	</div>
</template>

<script setup lang="ts" name="">
import { ref, shallowRef } from 'vue';
import { PopUp } from '../hooks/popUp'; 
import { popUpVueList } from '../data/list/popUpVueList';
	let tmp = defineProps(["popUp"])
	let popUp:PopUp = tmp.popUp
	let {name,buttons,vueName,index} = popUp
	let innerVue = shallowRef()
	if(popUp.vue){
		innerVue = popUp.vue
	}
	else if(vueName){
		innerVue = popUpVueList[vueName]
	}
	//尺寸
	let width = ref("650px")
	let height = ref("80%")
	if(popUp.size){
		if(popUp.size.width){
			width.value = popUp.size.width
		}
		if(popUp.size.height){
			height.value = popUp.size.height
		}
	}
</script>

<style lang="scss" scoped>
	@use "@/static/style/global.scss" as global;
	.popUp{
		background-color: global.$bgColor;
		max-width: 650px;
		max-height: 80%;
		box-shadow: black 0px 0px 50px;
		position: absolute;
		left:50%;
		top:50%;
		transform: translate(-50%, -50%);
		padding: 20px 20px;
		box-sizing: border-box;
		border-radius: 2%;
		pointer-events: auto;
		overflow-x: visible;
		overflow-y:auto;
			.titleName{
				position: relative;
				height: 70px;
				top: 0px;
				width: 300px;
				font-size: 60px;
				display: flex;
				align-items: center;
			}
			.titleSpace{
				height: 70px;
			}
			.titleButtons{
				height: 50px;
				position: absolute;
				right:0;
				top:0;
				width: 350px;
				display: flex;
				flex-direction: row-reverse;
			}
		
		.inner{
			height: calc(100% - 90px);
			width: 100%;
			box-sizing: border-box;
		}
	}
</style>