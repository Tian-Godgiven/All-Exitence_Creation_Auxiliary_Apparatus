<template>
	<view class="group">
		<view class="titleBar" @click="expending = !expending">
			<view class="titleName">{{name}}</view>
		</view>
		<view class="inner" v-show="expending">
			<view v-for="(exitence,index) in groupExitence">
				<exitenceVue :exitence="exitence"></exitenceVue>
				<view class="separator" v-if="index < groupExitence.length-1"></view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts" name=""> 
import { ref } from 'vue';
import exitenceVue from './exitence.vue';
	
	let expending = ref(true)
	let {group} = defineProps(["group"]) 
	let name = ref(group.name)
	let groupExitence = [{
		name:"测试分组",
		status:{},
		setting:{}
	},{
		name:"测试分组",
		status:{},
		setting:{}
	}]
</script>

<style lang="scss" scoped>
@import "@/static/style/leftPage.scss";
	.group{
		@extend .leftPageGroup;
	}
	.separator{
		@extend .leftPageSeparator;
	}
</style>