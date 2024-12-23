<template>
	<div class="group">
		<div class="titleBar" @click="expending = !expending">
			<div class="titleName">{{group.name}}</div>
		</div>
		<div class="inner" v-show="expending">
			<div v-for="(exitence,index) in groupExitence">
				<exitenceVue :exitence="exitence"></exitenceVue>
				<div class="separator" v-if="index < groupExitence.length-1"></div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name=""> 
import { ref } from 'vue';
import exitenceVue from './exitence.vue';
	
	let {group,groupExitence} = defineProps(["group","groupExitence"]) 

	//分组展开
	let expending = ref(true)
</script>

<style lang="scss" scoped>
@use "@/static/style/leftPage.scss";
	.group{
		@extend .leftPageGroup;
	}
	.separator{
		@extend .leftPageSeparator;
	}
</style>