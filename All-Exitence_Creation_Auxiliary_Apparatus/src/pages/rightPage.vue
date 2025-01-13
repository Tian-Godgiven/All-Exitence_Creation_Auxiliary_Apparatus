<template>
	<div class="rightPage">
		<!-- 右侧切换键 -->
		<buttonVue class="rightPageSwitchButton" 
			:style="ifRotate?{transform: 'rotate(' + rotateDegree + 'deg)'}:null"
			name="switchRight"
			icon="rightUp"
			@click="clickSwitch()">
		</buttonVue>

		<div class="buttons" :style="{right:rightWidth}">
			<buttonVue 
				:key="Symbol()"
				:icon="null"
				:name="abilitiy.name"
				@click="abilitiy.click"
				v-for="(abilitiy) in abilities">
			</buttonVue>
		</div>

		
		
	</div>
	
</template>

<script setup lang="ts" name="RightPage">
import { rightMaxWidth, rightShowWidth, switchRight } from '@/hooks/pages/pageChange';
import { computed,ref } from 'vue';
import buttonVue from '@/components/global/button.vue';
import { rightAbilityList } from '@/data/list/rightAbilityList';
	// 由于右侧页面是从右往左的，因此实际设定的是该页面的right属性
	let rightWidth = computed(()=>{
		return (rightShowWidth.value - rightMaxWidth) +"px"
	})
	
	//功能按键列表
	let abilities = rightAbilityList
	const rotateDegree = ref(0)
	const ifRotate = ref(true)
	//点击切换右侧，同时旋转按钮
	function clickSwitch(){
		rotateDegree.value += 180		
		switchRight()
	}
	
</script>

<style lang="scss" scoped>
	@use "@/static/style/global.scss" as global;
	// 右侧页面按键通用样式
	.rightPage{
		pointer-events: none;
		height:calc(100% - 550px);
		right: 0;
		top:350px;
		width:150px;
		background-color: transparent;
		position: absolute;
		z-index: 1;
		overflow: hidden;
		display: flex;
		flex-direction: column-reverse;
	}
	.buttons{
		overflow: auto;
		position: relative;
		max-height: calc(100% - 100px);
		width: 100%;
		display: flex;
		flex-direction: column-reverse;
	}
	.buttons::-webkit-scrollbar {
		display: none; /* Chrome, Safari */
	}
	.button{
		box-sizing: border-box;
		pointer-events: all;
		height: 100px;
		width: 100px;
		border-radius: 50%;
		background-color: global.$rightButtonColor;
		box-shadow: 0px 3px 6px 1px rgb(99, 99, 99);
		margin:15px;
		margin-top: 20px;
		z-index: 2;
		flex-shrink: 0
	}
	
	.rightPageSwitchButton{
		@extend .button;
		position: relative;
		z-index: 2;
		transition: transform 0.5s ease;
	}
</style>