<template>
	<div class="multiValue">
		<!-- 根据part的类型显示内容 -->
		<MultiPartValueVue class="part" v-for="(part,index) in parts" :index="index" :part="part"></MultiPartValueVue>
	</div>
</template>

<script setup lang="ts" name="">
import { watch, ref, provide } from 'vue'; 
import MultiPartValueVue from './multiPartValue.vue';
	const {status} = defineProps(["status"])
	const parts = ref(status.value)
	watch(()=>status,()=>{
		parts.value = status.value
	},{
		immediate:true,
		deep:true,
	})
	//提供当前属性中的所有parts
	provide("parts",parts)
	
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