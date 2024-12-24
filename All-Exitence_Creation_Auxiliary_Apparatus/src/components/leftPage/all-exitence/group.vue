<template>
	<div class="group">
		<div class="titleBar" @click="expending = !expending">
			<div class="titleButtons" >
				<div class="button" @click="clickUpdateGroup">编辑</div>
			</div>
			<div class="titleName">
				<div class="text">{{group.name}}</div>
			</div>
			
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
import { ref,inject, computed } from 'vue';
import exitenceVue from './exitence.vue';
import { updateGroup } from '@/hooks/all-exitence/allExitence';
import { filterExitenceByRule } from '@/hooks/expression/groupRule';
	
	let {group} = defineProps(["group","exitenceIndex"]) 
	const exitenceIndex = inject<any>("exitenceIndex")
	const type = inject<any>("type")
	//分组展开
	let expending = ref(true)
	//点击编辑分组
	function clickUpdateGroup(event:any){
		event.stopPropagation()
		updateGroup(type,group)
	}
	// 分组中的事物
	const groupExitence = computed(()=>{
		//遍历所有事物
		const tmp = type.exitence.reduce((arr:any[],exitence:any,index:number)=>{
			if(filterExitenceByRule(exitence,group.rules)){
				//去除这个index
				exitenceIndex.value[index] = false
				arr.push(exitence)
			}
			else{
				exitenceIndex.value[index] = true
			}
			return arr
		},[])
		return tmp
	})

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