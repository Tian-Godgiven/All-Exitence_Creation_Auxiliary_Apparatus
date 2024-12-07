<template>
    <component 
		:is="statusBonusInputList[status.valueType]">
	</component>
</template>

<script setup lang='ts'>
import { statusBonusInputList } from '@/data/list/statusBonusInputList';
    import { provide } from 'vue';
    const status = defineModel<any>()

    provide("status",status.value)
</script>

<style scoped lang='scss'>

</style>