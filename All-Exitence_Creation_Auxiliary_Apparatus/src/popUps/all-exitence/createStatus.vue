<template>
	<div class="updateStatus">
		<editStatusVue @confirm="createStatus" :banValueType="banValueType">
			<template v-slot:confirm>新增</template>
		</editStatusVue>
	</div>
</template>
<script setup lang="ts" name=""> 
	import { provide,reactive,toRaw } from 'vue'; 
	import { closePopUp } from '@/hooks/popUp';
	import Status from '@/interfaces/exitenceStatus';
	import editStatusVue from '@/components/popUps/all-exitence/status/editStatus.vue';

	const {props,popUp,returnValue} = defineProps(["props","popUp","returnValue"])
	const {allStatus,allTypeStatus,banValueType} = props
	const emits = defineEmits(["confirm"])

	// 新增属性
	let newStatus = reactive<Status>({
		name:"",
		value:null,
		valueType:"downLine",
		setting:{},
		__key:null
	})

	provide("status",newStatus)
	provide("typeStatus",newStatus)

	provide("allStatus",allStatus)
	provide("allTypeStatus",allTypeStatus)

	// 确认创建属性
	function createStatus(newStatus:Status){
		// 返回这个属性
		returnValue(JSON.parse(JSON.stringify(toRaw(newStatus))))
		closePopUp(popUp)
	}
	
	
</script>

<style lang="scss" scoped>
@use "@/static/style/components/inputs.scss";
@use "@/static/style/components/popUpButtons.scss";
	.newStatus{
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		padding: 10px 20px;
		.statusInfo{
			display: flex;
			min-height: 40px;
			width: 100%;
			.statusName{
				display: flex;
				width: 180px;
				box-sizing: border-box;
			}
			.statusValue{
				width: calc(100% - 190px);
			}
		}
		.statusSet{
			display: flex;
			align-items: center;
			height: 80px;
			.valueType{
				width: calc(100% - 400px);
				height: 80px;
			}
			.button{
				box-sizing: border-box;
				margin-left: 10px;
				width: 20%;
				height: 60px;
				border:3px solid black;
			}
		}
		
		.settingBox{
			max-height: 0px;
			width: 100%;
			overflow: hidden;
			transition: max-height 450ms ease-in-out;
		}
		.settingBox-show{
			max-height: 300px;
		}
		.buttons{
			@extend .buttons
		}
	}
	
	
</style>