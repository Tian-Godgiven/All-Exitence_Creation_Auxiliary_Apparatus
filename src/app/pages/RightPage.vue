<template>
	<div class="rightPage">
		<!-- 右侧切换键 -->
		<Button class="rightPageSwitchButton" 
			:style="{transform: 'rotate(' + rotateDegree + 'deg)'}"
			name="switchRight"
			icon="rightUp"
			@click="clickSwitch()">
		</Button>

		<div class="buttons" :style="{right:rightWidth}">
			<Button
				:key="Symbol()"
				:icon="null"
				:name="abilitiy.name"
				@click="abilitiy.click"
				v-for="(abilitiy) in abilities">
			</Button>
		</div>
	</div>
	
</template>

<script setup lang="ts" name="RightPage">
import { rightMaxWidth, rightShowWidth, rotateDegree, switchRight } from '@/hooks/pages/pageChange';
import { computed } from 'vue';
import Button from '@/components/global/Button.vue';
import { rightAbilityList } from '@/static/list/rightAbilityList';
	// 由于右侧页面是从右往左的，因此实际设定的是该页面的right属性
	let rightWidth = computed(()=>{
		return (rightShowWidth.value - rightMaxWidth) +"px"
	})
	
	//功能按键列表
	let abilities = rightAbilityList
	//点击切换右侧，同时也会旋转按钮
	function clickSwitch(){
		switchRight()
	}
	
</script>

<style lang="scss" scoped>
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
		background-color: $rightButtonColor;
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