<template>
	<div class="all-exitence">
		<typeVue v-for="(type,index) in types" :type="types[index]"></typeVue>
	</div>
</template>

<script setup lang="ts" name=""> 
import typeVue from './type.vue';

	import { types } from '@/hooks/all-exitence/allExitence';

</script>

<style lang="scss" scoped>
	@use "@/static/style/leftPage.scss";
	
	.all-exitence{
		width: 100%;
	}
</style>