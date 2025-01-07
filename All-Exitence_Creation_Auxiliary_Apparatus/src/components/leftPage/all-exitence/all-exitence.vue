<template>
	<div class="all-exitence">
		<draggableListVue :list="nowTypes" v-slot="{element:type}">
			<typeVue :key="type.__key" :type="type"/>
		</draggableListVue>
	</div>
</template>

<script setup lang="ts" name=""> 
import { computed } from 'vue';
import typeVue from './type.vue';
import draggableListVue from '@/components/other/draggableList/draggableList.vue';
	import { nowAllExitence } from '@/hooks/all-exitence/allExitence';
	const nowTypes = computed(()=>{
		return nowAllExitence.types
	})

</script>

<style lang="scss" scoped>
	@use "@/static/style/leftPage.scss";
	
	.all-exitence{
		width: 100%;
	}
</style>