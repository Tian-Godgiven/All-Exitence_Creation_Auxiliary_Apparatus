<template>
<div class="multiValue">
	<!-- 根据part的类型显示内容 -->
	<MultiPartValue class="part"
		:key="part.__key" 
		v-for="part in parts" 
		:parts
		:target
		:part="part"/>
</div>
</template>

<script setup lang="ts" name="">
import { watch, ref } from 'vue'; 
import MultiPartValue from './MultiPartValue.vue';
import { MultiStatusPart } from '@/hooks/expression/multiStatusValue';
import Status from '@/interfaces/Status';
import { Exitence, ExitenceStatus } from '@/class/Exitence';
import { Type } from '@/class/Type';
	const {fullStatus,target} = defineProps<{
		status:Status|ExitenceStatus,
		fullStatus:Status,
		target:Type|Exitence
	}>()
	//复合属性的属性值由part组成
	const parts = ref(fullStatus.value as MultiStatusPart[])
	watch(()=>fullStatus,()=>{
		parts.value = fullStatus.value
	},{
		immediate:true,
		deep:true,
	})
</script>

<style lang="scss" scoped>
	.multiValue{
		overflow: hidden;  /* 清除浮动 */
		width: 100%;
		
		.part{
			word-break: break-all;
			max-width: 100%;
			float: left;
			padding:0 5px;
		}
	}
</style>