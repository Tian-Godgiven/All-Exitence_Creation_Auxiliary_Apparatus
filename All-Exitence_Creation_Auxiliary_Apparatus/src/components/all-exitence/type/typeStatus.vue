<template>
	<div class="status">
		<!-- 属性名 -->
		<statusNameVue :status="status"></statusNameVue>
		<!-- 属性值 -->
		<statusValueVue :status="status" :typeStatus="status"  class="value"></statusValueVue>
		
		<div class="buttons">
			<div class="button" @click="showUpdateStatus">编辑</div>
			<div class="button" @click="deleteStatus">删除</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="typeStatus">
import { inject } from 'vue';
import statusNameVue from '../status/statusName.vue';
import statusValueVue from '../status/statusValue/statusValue.vue';
import { showPopUp } from '@/hooks/pages/popUp';
import Status from '@/interfaces/exitenceStatus';
	let {status} = defineProps(["status"])
	console.log(status)
	const emits = defineEmits(["deleteStatus"])
	//删除属性
	function deleteStatus(){
		emits('deleteStatus')
	}
	//点击弹出更新属性
    const allStatus = inject("allStatus")
    const allTypeStatus = inject("allTypeStatus")
	function showUpdateStatus(){
		showPopUp({
            mask:false,
            vueName:"updateStatus",
            buttons:[],
            props:{
                status,
                typeStatus:status,
                allStatus,
                allTypeStatus
            },
            returnValue:(newStatus:Status)=>{
				Object.assign(status,newStatus)
			}
        })
	}
</script>

<style lang="scss" scoped>
	.status{
		display: flex;
		.value{
			width: calc(100% - 200px);
		}
		.buttons{
			.button{
				height: 50px;
				width: 50px;
				overflow: hidden;
			}
		}
	}
</style>