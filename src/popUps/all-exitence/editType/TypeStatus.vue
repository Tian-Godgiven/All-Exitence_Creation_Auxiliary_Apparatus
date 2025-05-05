<template>
<div class="status">
	<StatusName :status="status"/>
	<StatusValue :status="status" :typeStatus="status"/>
	
	<div class="buttons">
		<Button @click="showUpdateStatus" name="编辑"></Button>
		<Button @click="deleteStatus" name="删除"></Button>
	</div>
</div>
</template>

<script setup lang="ts" name="typeStatus">
import { inject } from 'vue';
import StatusName from '@/components/all-exitence/status/StatusName.vue';
import StatusValue from '@/components/all-exitence/status/StatusValue.vue';
import { showPopUp } from '@/hooks/pages/popUp';
import Status from '@/interfaces/Status';
import Button from '@/components/global/Button.vue';
	let {status} = defineProps(["status"])
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
		:deep(.statusName){
			width: 200px;
		}
		.statusValue{
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