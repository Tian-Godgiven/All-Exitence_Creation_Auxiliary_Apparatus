<template>
<div class="container">
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

		<div class="missions">
			<div v-if="showMissions.length==0">
				还没有这个类型的任务哦！<br>点击[+]即可创建新任务！
			</div>
			<missionVue 
				v-for="mission in showMissions"
				:key="mission.__key"
				:mission="mission" />
		</div>
	</div>
	<transition name="slide">
		<EditMission class="editMission" v-if="ifShowEditMission"></EditMission>
	</transition>
</div>
	
</template>

<script setup lang="ts" name=""> 
	import { computed, reactive, Ref, ref } from 'vue';
	import EditMission from '../components/EditMission.vue';
	import missionVue from '../components/mission.vue';
	import MissionTag from '../components/missionTag.vue';
	import Button from '@/components/global/button.vue';
	import { createMission, showEditMission, ifShowEditMission, Mission, nowMissionList } from '../missionList';
	const missionList = nowMissionList
	//用于筛选的标签库
	const selectTags:Ref<{tag:string,num:number,chosen:boolean}[]> = computed(()=>{
		//三个列表合在一起
		const tmpList:Mission[] = missionList[state.value]
		const tmp = tmpList.reduce((arr:{tag:string,num:number,chosen:boolean}[],mission)=>{
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
			return b.num - a.num
		})
		return reactive(tmp)
	})
	//已选择的标签
	const chosenTags:Ref<string[]> = ref([])
	//切换显示的任务类型
	const state = ref<"doing"|"completed"|"failed">("doing")
	const stateMap = {
        doing: '进行中',
        completed: '已完成',
        failed: '失败',
    }
	const showMissions = computed(()=>{
		//获取相应状态的列表
		const list = missionList[state.value]
		const tmp = list.reduce((arr:Mission[],mission:Mission)=>{
			//标签筛选
			if(chosenTags.value.length>0){
				for(let theTag of chosenTags.value){
					//包含任意一个tag则返回
					if(mission.tags.includes(theTag)){
						arr.push(mission)
						return arr
					}
				}
			}
			else{
				arr.push(mission)
				return arr
			}
			return arr
		},[])
		return tmp
	})
	function switchType(type:"doing"|"completed"|"failed"){
		if(type != state.value){
			state.value = type
		}
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
	//创建新任务
	function createNewMission(){
		showEditMission(null,(newMission:Mission)=>{
			createMission(newMission)
		})
	}
</script>

<style lang="scss" scoped>
	.container{
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
	.missionList{
		height: 100%;
		position: relative;
		z-index: 1;
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
				display: flex;
				.tags{
					width: calc(100% - 90px);
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
					width: 90px;
					height: 1rem;
					position: absolute;
					right: 0;
					border-radius: 10px;
					background-color: gray;
				}
			}
		}
		.selectBar.expend{
			grid-template-rows:1fr;
		}
		.missions{
			max-height: 90%;
			overflow: hidden;
		}
		.missions::-webkit-scrollbar{
			width: 0;
		}
	}

	.editMission{
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 100%;
		z-index: 2;
	}

	.missionTag.chosen{
		color: black;
		background-color: white;
	}
	.missionTag.unchosen{
		color:rgb(31, 31, 31);
		background-color: rgb(98, 98, 98);
	}

	.slide-enter-active, .slide-leave-active {
		transition: transform 0.5s ease;
	}

	.slide-enter-from, .slide-leave-to /* .slide-leave-active in <2.1.8 */ {
		transform: translateX(100%); /* 初始状态在右侧外面 */
	}

	.slide-enter-to, .slide-leave-from /* .slide-leave-active in <2.1.8 */ {
		transform: translateX(0); /* 最终状态显示在父元素内 */
	}
</style>