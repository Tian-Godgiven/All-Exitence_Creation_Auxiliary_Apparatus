<template>
	<div>
		<ElSwitch v-model="status.value"
			style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
			:active-text="rightText"
			:inactive-text="leftText">
		</ElSwitch>
	</div>
</template>

<script setup lang="ts" name=""> 
import { ElSwitch } from 'element-plus';
import { computed, inject } from 'vue';
	const status = inject<any>("status")
	//默认为false
	if(status.value == null){
		status.value = null
	}
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