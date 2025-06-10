<template>
	<div class="radioValue">
		<radioVue class="radio" v-model="status.value"></radioVue>
		<div class="text">{{text}}</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'; 
import radioVue from '@/components/other/radio.vue';
import { ExitenceStatus } from '@/class/Exitence';
import Status from '@/interfaces/Status';
import { getStatusSettingValue } from '@/hooks/all-exitence/status';
	const {status,fullStatus} = defineProps<{
        status:Status|ExitenceStatus,
        fullStatus:Status
    }>()
	const text = computed(()=>{
		return getStatusSettingValue(fullStatus.setting,"radio","string")??""
	})
</script>

<style scoped lang="scss">
	.radioValue{
		display: flex; 
		height: 100%;
	}
</style>