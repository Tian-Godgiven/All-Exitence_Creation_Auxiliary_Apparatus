<template>
	<div class="popUp" :class="!popUp.position?'center':''" :style="{
		zIndex:index,
		height:popUp.size?.height,
		width:popUp.size?.width,
		left:popUp.position?.x,
		top:popUp.position?.y
	}">
		<div class="title">
			<div class="titleName" v-if="name">{{ name }}</div>
			<div class="titleSpace" v-else-if="buttons!=null"></div>
			<div class="titleButtons" v-if="buttons!=null">
				<Button :icon="button.icon" :name="button.name" @click="button.click" v-for="(button) in buttons"></Button>
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
import { shallowRef } from 'vue';
import { PopUp } from '@/hooks/pages/popUp'; 
import { popUpVueList } from '@/static/list/popUpVueList';
import Button from '@/components/global/Button.vue';
	const {popUp} = defineProps<{popUp:PopUp}>()
	let {name,buttons,vueName,index} = popUp

	let innerVue = shallowRef()
	if(popUp.vue){
		innerVue = popUp.vue
	}
	else if(vueName){
		innerVue = popUpVueList[vueName]
	}
</script>

<style lang="scss" scoped>
	.popUp{
		background-color: $bgColor;
		width: 650px;
		height: 80%;
		max-width: 100%;
		max-height: 80%;
		box-shadow: black 0px 0px 50px;
		position: absolute;
		box-sizing: border-box;
		border-radius: 10px;
		pointer-events: auto;
		overflow-x: visible;
		overflow-y:auto;
		.title{
			padding:0 20px;
			padding-top: 20px;
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
				height: 30px;
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
		
		}
			
		.inner{
			height: calc(100% - 90px);
			width: 100%;
			>div{
				box-sizing: border-box;
				padding: 20px;
				padding-top: 0;
			}
		}
	}
	//居中显示
	.popUp.center{
		left:50%;
		top:50%;
		transform: translate(-50%, -50%);
	}
</style>