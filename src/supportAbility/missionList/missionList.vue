<template>
	<div class="missionList">
		<div class="switchBar">
			<div v-for="(label, type) in stateMap" 
				:key="type" 
				:class="{ chosenType: state === type }" 
				@click="switchType(type)">
				{{ label }}
			</div>
		</div>

		<Button name="创建新任务" 
			@click="createNewMission" class="createNew" 
			icon="add"></Button>

		<div class="selectBar" :class="expendSelectBar?'expend':''">
			<div class="container">
				<div class="tags">
					<MissionTag 
						@click="switchChoseTag(missionTag)" 
						v-for="missionTag in selectTags"
						:class="(!missionTag.chosen && chosenTags.length > 0)?'unchosen':'chosen'"
						:tag="missionTag.tag">
						<span class="missionNum">{{ missionTag.num }}</span>
					</MissionTag>
				</div>
				<div class="switchSelectBar" @click="swicthShowAllTags">展开所有</div>
			</div>
		</div>

		<div class="missionList">
			<missionVue 
				v-for="mission in showMissions"
				:key="mission.__key"
				:mission="mission" />
		</div>
	</div>
</template>

<script setup lang="ts" name=""> 
	import { computed, Ref, ref } from 'vue';
	import missionVue from './components/mission.vue';
	import MissionTag from './components/missionTag.vue';
	import Button from '@/components/global/button.vue';
	import { createNewMission, Mission, nowMissionList } from './missionList';
	const missionList = nowMissionList
	//用于筛选的标签库
	const selectTags:Ref<{tag:string,num:number,chosen:boolean}[]> = computed(()=>{
		const tmp = missionList.reduce((arr:{tag:string,num:number,chosen:boolean}[],mission)=>{
			mission.tags.forEach((tag)=>{
				const index = arr.findIndex((arrTag)=>arrTag.tag == tag)
				if(index>-1){
					arr[index].num +=1
				}
				else{
					arr.push({
						tag,
						num:1,
						chosen:false
					})
				}
			})
			return arr
		},[])
		//数量越多的排在越前面
		tmp.sort((a,b)=>{
			return a.num - b.num
		})
		return tmp
	})
	//已选择的标签
	const chosenTags:Ref<string[]> = ref([])
	//切换显示的任务类型
	const state = ref("doing")
	const stateMap = {
        doing: '进行中',
        completed: '已完成',
        failed: '失败',
    }
	const showMissions = computed(()=>{
		const tmp = missionList.reduce((arr:Mission[],mission:Mission)=>{
			//状态筛选
			if(mission.state == state.value){
				//标签筛选
				if(selectTags.value.length>0){
					selectTags.value.forEach((theTag)=>{
						//包含任意一个tag则返回
						if(mission.tags.includes(theTag.tag)){
							arr.push(mission)
							return arr
						}
					})
				}
				else{
					arr.push(mission)
					return arr
				}
			}
			return arr
		},[])
		console.log(tmp)
		return tmp
	})
	function switchType(type:"doing"|"completed"|"failed"){
		if(type != state.value)
		state.value = type
	}
	//点击标签进行筛选
	function switchChoseTag(missionTag:{tag:string,num:number,chosen:boolean}){
		//该标签已选中
		if(missionTag.chosen){
			//移除该标签
			const index = chosenTags.value.indexOf(missionTag.tag)
			chosenTags.value.splice(index,1)
		}
		else{
			//将该标签加入已选择的标签
			chosenTags.value.push(missionTag.tag)
		}
		//切换状态
		missionTag.chosen = !missionTag.chosen
	}
	//点击切换所有标签的显示
	const expendSelectBar = ref(false)
	function swicthShowAllTags(){
		expendSelectBar.value = !expendSelectBar.value
	}
</script>

<style lang="scss" scoped>
	.missionList{
		.switchBar{
			height: 100px;
			width: 100%;
			display: flex;
			>div{
				flex-grow: 1;
				width: 33%;
				display: flex;
				align-items: center;
				justify-content: center;
				border-bottom: 5px solid black;
			}
			>div:first-of-type{
				border-top-left-radius: 10px;
			}
			>div:last-of-type{
				border-top-right-radius: 10px;
			}
			.chosenType{
				font-weight: 1000;
				border:4px solid black;
				border-bottom-color: white;
			}
			>div:not(.chosenType){
				background-color: rgb(163, 163, 163);
				color: rgb(88, 88, 88);;
			}
		}
		.createNew{
			background-color: white;
			z-index: 2;
			width: 75px;
			height: 75px;
			border: 4px solid black;
			border-radius: 9px;
			position: fixed;
			bottom:150px;
			right: 30px;
		}
		.selectBar{
			width: 100%;
			display:grid;
			grid-template-rows:0fr; //初始占用0行
			transition:1s;//自行设定动画时间
			.container{
				min-height: 50px;
				.tags{
					display: flex;
					flex-wrap: wrap;
					.missionNum{
						position: relative;
						display: flex;
						align-items: center;
						justify-content: center;
						width: 1rem;
						height: 1rem;
						border-radius: 50%;
						background-color: rgb(191, 191, 191);
					}
				}
				.switchSelectBar{
					position: absolute;
					right: 0;
					border-radius: 50%;
					background-color: gray;
				}
			}
		}
		.selectBar.expend{
			grid-template-rows:1fr;
		}

	}

	.missionTag.chosen{
		color: black;
		background-color: white;
	}
	.missionTag.unchosen{
		color:rgb(31, 31, 31);
		background-color: rgb(98, 98, 98);
	}
</style>