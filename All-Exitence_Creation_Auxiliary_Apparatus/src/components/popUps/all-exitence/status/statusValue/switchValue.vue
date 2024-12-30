<template>
	<div>
		<ElSwitch 
			v-model="status.value"
			style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
			:active-text="rightText"
			:inactive-text="leftText">
		</ElSwitch>
	</div>
</template>

<script setup lang="ts" name=""> 
import { ElSwitch } from 'element-plus';
import { computed } from 'vue';
	const {status,statusSetting} = defineProps(["status","statusSetting"])
	//默认为false
	if(!status.value){
		status.value = false
	}
	//显示文本
	const leftText = computed(()=>{
		const tmp = statusSetting?.switch[0]
		return  tmp??"" 
	})
	const rightText = computed(()=>{
		const tmp = statusSetting?.switch[1]
		return  tmp??"" 
	})
</script>

<style lang="scss" scoped>

</style>