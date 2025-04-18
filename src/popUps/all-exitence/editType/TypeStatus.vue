<template>
<div class="status">
	<statusName :status="status"></statusName>
	<statusValue :status="status" :typeStatus="status"  class="value"></statusValue>
	
	<div class="buttons">
		<Button @click="showUpdateStatus" name="编辑"></Button>
		<Button @click="deleteStatus" name="删除"></Button>
	</div>
</div>
</template>

<script setup lang="ts" name="typeStatus">
import { inject } from 'vue';
import statusName from '@/components/all-exitence/status/statusName.vue';
import statusValue from '@/components/all-exitence/status/statusValue/statusValue.vue';
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