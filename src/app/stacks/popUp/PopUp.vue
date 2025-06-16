<template>
	<div class="popUp" 
	ref="popUp"
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
		<div class="top" :class="name?'':'noTitle'" v-if="ifTop">
			<div class="title" v-if="name">{{ name }}</div>
			<div class="space" v-else-if="buttons!=null"></div>
			<div class="buttons" v-if="buttons!=null">
				<Button v-for="(button) in buttons" 
					:icon="button.icon" :name="button.name" 
					@click="button.click" ></Button>
			</div>
		</div>
		
		<div class="inner" ref="inner" :class="ifTop?'':'noTop'">
			<component :is="innerVue" 
				:popUp="popUp" 
				:returnValue="popUp?.returnValue"
				:props='popUp.props'>
			</component>
		</div>
	</div>
</template>

<script setup lang="ts" name="">
import { nextTick, onMounted, shallowRef, useTemplateRef } from 'vue';
import { PopUp } from '@/hooks/pages/popUp'; 
import { popUpVueList } from '@/static/list/popUpVueList';
import Button from '@/components/global/Button.vue';
import gsap from 'gsap';
	const {popUp} = defineProps<{popUp:PopUp}>()
	const {name,buttons,vueName,index} = popUp
	const innerVue = shallowRef(popUp.vue || (vueName && popUpVueList[vueName]));
	const ifTop = name||buttons

	onMounted(async()=>{
		await nextTick();
		popUpAnimate();
	})

	const popUpRef = useTemplateRef("popUp")
	const innerRef = useTemplateRef("inner")
	function popUpAnimate(){
		// GSAP动画序列
		const tl = gsap.timeline();
		tl.to(popUpRef.value, {
			scale: 1,
			opacity: 1,
			duration: 0.3,
			ease: "power2.out"
		})
		.to(innerRef.value, {
			opacity: 1,
			duration: 0.2,
			ease: "sine.in"
		}, "-=0.2"); // 与前一个动画重叠0.1秒
	}
	
</script>

<style lang="scss" scoped>
.popUp{
	opacity:0; 
	transform: scale(0.3);
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
		display: flex;
		justify-content: space-between;
		z-index: 1;
		&.noTitle{
			height: 0;
		}
		.title{
			flex-grow: 1;
			position: relative;
			height: 70px;
			top: 0px;
			width: 300px;
			font-size: 1.5rem;
			display: flex;
			align-items: center;
		}
		.buttons{
			height: 50px;
			display: flex;
			gap: 5px;
			.button{
				aspect-ratio: 1;
				height: 100%;
			}
		}
	
	}
		
	.inner{
		opacity:0;
		position: relative;
		z-index: 0;
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
		transform: translateX(-50%) scale(0.5);
	}
	&.centerY{
		top:50%;
		transform: translateY(-50%) scale(0.5);
	}
	&.centerX.centerY{
		left:50%;
		top:50%;
		transform: translate(-50%,-50%) scale(0.5);
	}
}
</style>