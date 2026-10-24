<template>
	<div class="popUp" 
	ref="popUp"
	:class="[
		!popUp.position?.x?'centerX':'',
		!popUp.position?.y?'centerY':'',
		popUp.className,
		popUp.size?.height && popUp.size.height !== 'auto' ? 'fixedHeight' : ''
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
import Button from '@/components/global/button.vue';
import gsap from 'gsap';
	const {popUp} = defineProps<{popUp:PopUp}>()
	const {name,buttons,vueName,index} = popUp
	const innerVue = shallowRef(popUp.vue || (vueName && popUpVueList[vueName]));
	const ifTop = name||buttons

	onMounted(async()=>{
		await nextTick();
		keepPositionInViewport()
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

	function keepPositionInViewport(){
		if(!popUp.position || !popUpRef.value)return
		const margin = 8
		const requestedX = Number.parseFloat(popUp.position.x)
		const requestedY = Number.parseFloat(popUp.position.y)
		const x = Math.min(Math.max(requestedX, margin), window.innerWidth - popUpRef.value.offsetWidth - margin)
		const y = Math.min(Math.max(requestedY, margin), window.innerHeight - popUpRef.value.offsetHeight - margin)
		popUp.position.x = `${x}px`
		popUp.position.y = `${y}px`
	}
	
</script>

<style lang="scss" scoped>
.popUp{
	opacity:0; 
	transform: scale(0.3);
	background-color: $bgColor;
	// width: 650px;
	height: auto;
	max-width: 100%;
	max-height: 80vh;
	box-shadow: rgba(114, 114, 114, 0.76) 0px 0px 8px;
	position: absolute;
	box-sizing: border-box;
	border-radius: 10px;
	pointer-events: auto;
	overflow:hidden;
	display: flex;
	flex-direction: column;
	&.controlPanelPopUp{
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
		.inner{ padding: 2px !important;}
	}
	.top{
		padding: 0 16px;
		position: relative;
		display: flex;
		flex: 0 0 auto;
		justify-content: space-between;
		z-index: 1;
		&.noTitle{
			height: 36px;
		}
		.title{
			flex-grow: 1;
			position: relative;
			height: 44px;
			top: 0px;
			max-width: 300px;
			font-size: 1.25rem;
			display: flex;
			align-items: center;
		}
		.buttons{
			height: 28px;
			align-self: center;
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
		flex: 0 1 auto;
		width: 100%;
		display:flex;
		box-sizing: border-box;
		padding: 0 16px 16px;
		overflow: auto;
		&.noTop{
			padding: 16px;
		}
	}
	&.fixedHeight .inner{
		flex: 1 1 auto;
		min-height: 0;
		max-height: none;
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

@media (min-width: 900px){
	.popUp{
		max-height: min(760px, calc(100vh - 48px));
		.inner{
			max-height: calc(min(760px, 100vh - 48px) - 52px);
		}
	}
}
</style>
