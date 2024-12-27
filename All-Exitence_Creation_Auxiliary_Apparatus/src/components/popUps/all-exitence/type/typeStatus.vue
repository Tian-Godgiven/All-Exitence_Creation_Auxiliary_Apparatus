<template>
	<div class="status">
		<!-- 属性名 -->
		<div class="name">
			<textAreaVue
				v-model="status.name"
				placeholder="属性名">
			</textAreaVue>
		</div>
		<div class="separator">：</div>
		<!-- 属性值 -->
		<statusValueVue class="value"></statusValueVue>
		
		<div class="buttons">
			<div class="button" @click="showUpdateStatus">编辑</div>
			<div class="button" @click="deleteStatus">删除</div>
		</div>
		<div class="statusSetting"></div>
	</div>
</template>

<script setup lang="ts" name="typeStatus">
import { inject, provide } from 'vue';
import statusValueVue from '../status/statusValue/statusValue.vue';
import textAreaVue from '@/components/other/textArea/textArea.vue';
import { showPopUp } from '@/hooks/pages/popUp';
import Status from '@/interfaces/exitenceStatus';
	const model = defineModel("status")
	let status:any = model.value
	const emits = defineEmits(["deleteStatus"])
	//对于分类对象来说，其属性就是分类属性
	provide("status",status)
	provide("typeStatus",status)
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
				status = newStatus
			}
        })
	}
</script>

<style lang="scss" scoped>
	.status{
		display: flex;
		.name{
			width:calc(150px - 1rem);
			box-sizing: border-box;
		}
		.separator{
			min-width: 1rem;
		}
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