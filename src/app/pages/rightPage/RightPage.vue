<template>
<div ref="rightPageRef" class="rightPage" :style="{right:rightWidth}">
	<div class="top">
		<div class="title">工具库</div>
	</div>
	<div class="abilityList">
		<Ability v-for="ability in abilities" :ability />
	</div>
</div>
</template>

<script setup lang="ts" name="RightPage">
import { hidePage, rightMaxWidth, rightShowWidth} from '@/hooks/pages/pageChange';
import { computed, onBeforeUnmount, onMounted, useTemplateRef } from 'vue';
import { rightAbilityList } from '@/static/list/rightAbilityList';
import Ability from './components/Ability.vue';
	// 由于右侧页面是从右往左的，因此实际设定的是该页面的right属性
	let rightWidth = computed(()=>{
		return (rightShowWidth.value - rightMaxWidth) +"px"
	})
	const rightPageRef = useTemplateRef("rightPageRef")
	function closeOnOutsidePointerDown(event: PointerEvent){
		if(rightShowWidth.value === 0) return
		const target = event.target
		if(!(target instanceof Element)) return
		if(rightPageRef.value?.contains(target) || target.closest(".rightPageToggle")) return
		hidePage("right")
	}
	onMounted(() => document.addEventListener("pointerdown", closeOnOutsidePointerDown, true))
	onBeforeUnmount(() => document.removeEventListener("pointerdown", closeOnOutsidePointerDown, true))
	
	//功能列表
	const abilities = computed(()=>rightAbilityList.value)
</script>

<style lang="scss" scoped>
@media (min-width: 900px){
	.rightPage.rightPage{
		width: 320px;
		border-left: 1px solid $bgColor70;
		box-sizing: border-box;
	}
	.rightPage .abilityList{
		align-content: start;
		grid-auto-rows: 80px;
	}
	.rightPage.rightPage .top{
		height: 60px;
	}
	.rightPage.rightPage .abilityList{ height: calc(100% - 60px); }
}

// 右侧页面
.rightPage{
	position: absolute;
	right: 0;
	top:0;
	width:70vw;
	height: 100%;
	z-index: 5;
	overflow: hidden;
	background-color: $bgColor;
	.top{
		padding-left: 20px;
		width:100%;
		word-break: break-all;
		background-color: $bgColor;
		height: 110px;
		display: flex;
		position: relative;
		z-index: 1;
		box-sizing: border-box;
		border-bottom: 3px solid $bgColor70;
		.title{
			flex-grow: 1;
			display: flex;
			align-items: center;
			// font-weight: 600;
			height: 100%;
			font-size: $fontSize40;
		}
	}
	.abilityList{
		height: calc(100% - 110px);
		overflow: auto;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
}
</style>
