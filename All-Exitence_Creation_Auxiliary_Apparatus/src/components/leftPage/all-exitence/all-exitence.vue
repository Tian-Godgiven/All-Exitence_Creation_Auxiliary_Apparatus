<template>
	<div class="all-exitence">
		<typeVue v-for="(type,index) in types" :type="type"></typeVue>
	</div>
</template>

<script setup lang="ts" name=""> 
import { ref } from 'vue';
import typeVue from './type.vue';

	import AllExitence from "@/data/projects/项目1/all-exitence.json"

	let allExitence = AllExitence;
	let types = allExitence.types


</script>

<style lang="scss" scoped>
	@use "@/static/style/leftPage.scss";
	
	.all-exitence{
		width: 100%;
	}
</style>