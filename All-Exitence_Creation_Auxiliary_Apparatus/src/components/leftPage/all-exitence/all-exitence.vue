<template>
	<div class="all-exitence">
		<typeVue :key="Symbol()" v-for="type in nowTypes" :type="type"></typeVue>
	</div>
</template>

<script setup lang="ts" name=""> 
import { computed } from 'vue';
import typeVue from './type.vue';
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