<template>
<div>
	<ElSwitch 
		class="switch"
		v-model="status.value"
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
.switch{
	color: $bgColor70;
	--el-switch-on-color: black; 
	--el-switch-off-color: rgb(180,180,180);
	:deep(.el-switch__label){
		color:$bgColor70;
	};
	:deep(.el-switch__label.is-active){
		color:$antiBgColor;
	}
}
</style>