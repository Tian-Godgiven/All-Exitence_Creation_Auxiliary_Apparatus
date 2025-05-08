<template>
	<div class="popUp" 
	:class="[
		!popUp.position?.x?'centerX':'',
		!popUp.position?.y?'centerY':''
	]" 
	:style="{
		zIndex:index,
		height:popUp.size?.height,
		width:popUp.size?.width,
		left:popUp.position?.x,
		top:popUp.position?.y
	}">
		<div class="top" v-if="ifTop">
			<div class="title" v-if="name">{{ name }}</div>
			<div class="space" v-else-if="buttons!=null"></div>
			<div class="buttons" v-if="buttons!=null">
				<Button v-for="(button) in buttons" 
					:icon="button.icon" :name="button.name" 
					@click="button.click" ></Button>
			</div>
		</div>
		
		<div class="inner" :class="ifTop?'':'noTop'">
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
	const {name,buttons,vueName,index} = popUp
	const innerVue = shallowRef(popUp.vue || (vueName && popUpVueList[vueName]));
	const ifTop = name||buttons
</script>

<style lang="scss" scoped>
.popUp{
	background-color: $bgColor;
	width: 650px;
	height: 80%;
	max-width: 100%;
	max-height: 80vh;
	box-shadow: black 0px 0px 50px;
	position: absolute;
	box-sizing: border-box;
	border-radius: 10px;
	pointer-events: auto;
	overflow:hidden;
	.top{
		padding:0 20px;
		padding-top: 20px;
		position: relative;
		.title{
			position: relative;
			height: 70px;
			top: 0px;
			width: 300px;
			font-size: 1.5rem;
			display: flex;
			align-items: center;
		}
		.space{
			height: 30px;
		}
		.buttons{
			height: 50px;
			position: absolute;
			right:10px;
			top:10px;
			width: 350px;
			display: flex;
			flex-direction: row-reverse;
			.button{
				aspect-ratio: 1;
				height: 100%;
			}
		}
	
	}
		
	.inner{
		height: calc(100% - 90px);
		width: 100%;
		display:flex;
		box-sizing: border-box;
		padding: 0 20px;
		&.noTop{
			height: 100%;
			padding: 10px 20px;
		}
	}
	&.centerX{
		left:50%;
		transform: translateX(-50%);
	}
	&.centerY{
		top:50%;
		transform: translateY(-50%);
	}
	&.centerX.centerY{
		left:50%;
		top:50%;
		transform: translate(-50%,-50%);
	}
}
</style>