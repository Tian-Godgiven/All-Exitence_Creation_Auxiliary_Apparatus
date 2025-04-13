<template>
<div class="rightPage" :style="{right:rightWidth}">
	<div class="title">辅助功能</div>
	<AbilityGroup v-for="list,name in abilities" :list :name/>
</div>
</template>

<script setup lang="ts" name="RightPage">
import { rightMaxWidth, rightShowWidth} from '@/hooks/pages/pageChange';
import { computed } from 'vue';
import { rightAbilityList } from '@/static/list/rightAbilityList';
import AbilityGroup from '@/components/rightPage/AbilityGroup.vue';
	// 由于右侧页面是从右往左的，因此实际设定的是该页面的right属性
	let rightWidth = computed(()=>{
		return (rightShowWidth.value - rightMaxWidth) +"px"
	})
	
	//功能列表
	let abilities = rightAbilityList
	
</script>

<style lang="scss" scoped>
	// 右侧页面
	.rightPage{
		position: absolute;
		background-color: $bgColor;
		right: 0;
		top:0;
		width:70vw;
		z-index: 1;
		overflow: hidden;
	}
</style>