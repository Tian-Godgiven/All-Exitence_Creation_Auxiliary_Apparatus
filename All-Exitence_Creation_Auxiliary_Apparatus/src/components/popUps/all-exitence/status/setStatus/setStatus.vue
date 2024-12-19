<template>
    <!-- 属性设置栏 -->
    <div class="settingBox" :class="show? 'settingBox-show':''">
		<div class="container"> <!--别删！对css样式有用！-->
			<setStatusOptionVue 
				v-for="(option,index) in setOptions" 
				:setOption="option"
				:ref="`option-${index}`"/>
		</div>
    </div>
</template>

<script setup lang='ts'>
	import setStatusOptionVue from "./setStatusOption.vue";
	import { statusSettingList } from "@/data/list/statusSettingList.ts";
    import { ref, inject, computed } from 'vue';

    const status = inject<any>("status")
	const typeStatus = inject<any>("typeStatus")
	const {show} = defineProps(["show"])
	defineExpose({
		"checkSet":checkSetOption
	})

	//提供给select检验的是与typeStatus整合后的结果
	const selectStatus = {...typeStatus,...status}
	let setOptions = computed(()=>{
		const tmp = statusSettingList.reduce((acc,option)=>{
			//满足该设置项的select需求或者该设置项不具备select
			if(!option.select || option.select(selectStatus) == true){
				acc.push(option)
			}
			return acc
		},<any[]>[])
		return tmp
	})

	// 选项子组件
	const optionRefs:any[] = setOptions.value.map((_,) => ref(null));


	//检查各个设置选项是否符合需求
	function checkSetOption(){
		let ifChecked = true
		// 使用 for...of 来循环，检查到第一个不符合的就返回 false
		for (let childRef of optionRefs) {
			// 其中任一设置项返回 false 时，立即返回 false
			if (childRef.value && childRef.value.confirmValue() !== true) {
				ifChecked = false;
				break; // 一旦发现不符合要求，停止遍历
			}
		}
		return ifChecked
	}
</script>

<style scoped lang='scss'>
	.settingBox{
		width: 100%;
		overflow: hidden;
		display:grid;
		grid-template-rows:0fr; //初始占用0行
		transition: 500ms ease-in-out;//自行设定动画时间
		.container{
			min-height: 0;
			width: 100%;
		}
	}
	.settingBox-show{
		grid-template-rows:1fr;
	}
</style>