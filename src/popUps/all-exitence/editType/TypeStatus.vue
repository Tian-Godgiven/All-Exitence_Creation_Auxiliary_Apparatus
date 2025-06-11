<template>
<div class="status">
	<StatusName :status :fullStatus="status"/>
	<StatusValue :status :fullStatus="status"/>
	<div class="buttons">
		<Button @click="showUpdateStatus" name="编辑"></Button>
		<Button @click="deleteStatus" name="删除"></Button>
	</div>
</div>
</template>

<script setup lang="ts" name="typeStatus">
import StatusName from '@/components/all-exitence/status/StatusName.vue';
import StatusValue from '@/components/all-exitence/status/StatusValue.vue';
import Status from '@/interfaces/Status';
import Button from '@/components/global/Button.vue';
import { showEditStatusPopUp } from '@/hooks/all-exitence/status';
import { Type } from '@/class/Type';
	const {status,type} = defineProps<{status:Status,type:Type}>()
	const emits = defineEmits(["deleteStatus"])
	//删除属性
	function deleteStatus(){
		emits('deleteStatus')
	}
	//点击弹出更新属性
	function showUpdateStatus(){
		showEditStatusPopUp({
			target:type,
			status,
			fullStatus:status,
			returnValue:(newStatus)=>{
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