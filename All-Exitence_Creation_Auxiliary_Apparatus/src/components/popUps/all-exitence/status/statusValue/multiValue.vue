<template>
	<div>
		<!-- 根据part的类型显示内容 -->
		<div v-for="(part) in parts">
			<br v-if="part.valueType == 'enterLine'">
			<statusValueVue 
				v-else-if="part.valueType == 'statusValue'"
				v-model="part.value">

			</statusValueVue>
			<div v-else :class="part.valueType" >{{ showPart(part) }}</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="">
import { inject, ref } from 'vue'; 
import statusValueVue from './statusValue.vue';
	const status = inject<any>("status")
	const typeStatus = inject<any>("typeStatus")
	const changeStatusValue = inject<(value:any)=>any>("changeStatusValue",()=>{})
	const parts = ref(status['value'])
	
	//part的显示内容与类型有关
	function showPart(part){
		switch (part.valueType){
			case "text":
				return part.value;
			case "quoteStatus":
				return "引用属性:"+getQuoteStatus(part.value).name;
			case "quotePart":
				return "引用部分:"+part.value;
			case "expression":
				return;
			case "statusValue":
				return 

		}
	}

	//获取引用的属性
	function getQuoteStatus(statusKey:string){
		return typeStatus.find((status:any)=>{
			return status.__key == statusKey
		})
	}
</script>

<style lang="scss" scoped>

</style>