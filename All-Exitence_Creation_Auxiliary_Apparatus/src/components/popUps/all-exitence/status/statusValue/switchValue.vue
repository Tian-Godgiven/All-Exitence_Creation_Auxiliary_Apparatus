<template>
	<div>
		<ElSwitch v-model="newValue"
			style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
			:active-text="rightText"
			:inactive-text="leftText"
			@change="changeStatusValue(newValue)">
		</ElSwitch>
	</div>
</template>

<script setup lang="ts" name=""> 
import { ElSwitch } from 'element-plus';
import { computed, inject, ref } from 'vue';
	const status = inject<any>("status")
	const changeStatusValue = inject<(value:any)=>any>("changeStatusValue",()=>{})
	//默认为false
	if(status["value"] == null){
		changeStatusValue(false)
	}
	const newValue = ref(status["value"])
	//显示文本
	const leftText = computed(()=>{
		const tmp = status["setting"]["switch"][0]
		return  tmp?tmp:"" 
	})
	const rightText = computed(()=>{
		const tmp = status["setting"]["switch"][1]
		return  tmp?tmp:"" 
	})
</script>

<style lang="scss" scoped>

</style>