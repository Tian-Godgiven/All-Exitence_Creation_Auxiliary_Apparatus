<template>
<div class="status">
	<StatusName :status :fullStatus="status"/>
	<StatusValue class="statusValue" :status :fullStatus="status" :target="type"/>
	<div class="buttons">
		<Button @click="showUpdateStatus" name="编辑"></Button>
		<Button @click="deleteStatus" name="删除"></Button>
	</div>
</div>
</template>

<script setup lang="ts" name="typeStatus">
import StatusName from '@/components/all-exitence/status/statusName.vue';
import StatusValue from '@/components/all-exitence/status/StatusValue.vue';
import Status from '@/interfaces/Status';
import Button from '@/components/global/button.vue';
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
		display: grid;
		grid-template-columns: max-content minmax(0, 1fr) auto;
		align-items: center;
		gap: 12px;
		:deep(.statusLabel){ min-width: 0; }
		.statusValue{
			min-width: 0;
		}
		.buttons{
			display: flex;
			gap: 4px;
			.button{
				height: 44px;
				min-width: 56px;
				padding: 0 10px;
				white-space: nowrap;
			}
		}
	}
	@media (max-width: 899px){
		.status{
			grid-template-columns: minmax(0, 1fr) auto;
			gap: 6px;
			:deep(.statusLabel){ grid-column: 1 / -1; }
			.statusValue{ grid-column: 1 / -1; }
			.buttons{ grid-column: 1 / -1; justify-content: flex-end; }
		}
	}
</style>
