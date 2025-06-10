<template>
<div>
	<ElSwitch 
		class="switch"
		v-model="status.value"
		:inactive-text="switchText.left"
		:active-text="switchText.right">
	</ElSwitch>
</div>
</template>

<script setup lang="ts" name=""> 
import { ExitenceStatus } from '@/class/Exitence';
import { getStatusSettingValue } from '@/hooks/all-exitence/status';
import Status from '@/interfaces/Status';
import { ElSwitch } from 'element-plus';
import { computed } from 'vue';
	const {status,fullStatus} = defineProps<{
        status:Status|ExitenceStatus,
        fullStatus:Status
    }>()
	//默认为false
	if(!status.value){
		status.value = false
	}
	//显示文本
	const switchText = computed(()=>{
		const switchValue = getStatusSettingValue<string>(fullStatus.setting,"switch","arr") 
			?? ["",""]
		return {
			left:switchValue[0],
			right:switchValue[1]
		}
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