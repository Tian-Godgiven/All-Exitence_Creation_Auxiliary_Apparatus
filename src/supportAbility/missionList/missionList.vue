<template>
	<div class="missionList">
		<div class="switchBar">
			<div @click="switchType('doing')">当前任务</div>
			<div @click="switchType('finished')">已完成</div>
			<div @click="switchType('failed')"">失败任务</div>
		</div>

		<div class="createNew" @click="createNewMission">
			创建新任务
		</div>

		<div class="missionList">
			<div class="selectBar">
				<div>显示数量最多一排标签</div>
				<div>点击展开所有标签</div>
			</div>
			<missionVue 
				v-for="mission in missionList"
				:key="mission.__key"
				:mission="mission" />
		</div>
	</div>
</template>

<script setup lang="ts" name=""> 
import missionVue from './mission.vue';
import { createNewMission, nowMissionList } from './missionList';
	const missionList = nowMissionList
	//切换任务类型
	function switchType(type:string){
		
	}
</script>

<style lang="scss" scoped>

</style>