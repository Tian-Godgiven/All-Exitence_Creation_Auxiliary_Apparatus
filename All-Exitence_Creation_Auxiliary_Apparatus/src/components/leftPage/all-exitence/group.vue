<template>
	<div class="group">
		<div class="titleBar" @click="expending = !expending">
			<div class="titleName">{{name}}</div>
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
	
	let expending = ref(true)
	let {group} = defineProps(["group"]) 
	let name = ref(group.name)
	let groupExitence = [{
		name:"测试分组",
		status:[],
		setting:{}
	},{
		name:"测试分组",
		status:[],
		setting:{}
	}]
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