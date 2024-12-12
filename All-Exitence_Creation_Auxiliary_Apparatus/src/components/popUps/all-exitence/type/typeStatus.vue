<template>
	<div  class="status">
		<!-- 属性名 -->
		<div class="name">
			<textAreaVue
				v-model="status['name']"
				placeholder="属性名">
			</textAreaVue>
		</div>
		<div class="separator">：</div>
		<!-- 属性值 -->
		<statusValueVue class="value"></statusValueVue>
		<div class="buttons">
			<div class="button">编辑</div>
			<div class="button" @click="deleteStatus">删除</div>
		</div>
		<div class="statusSetting"></div>
	</div>
</template>

<script setup lang="ts" name="typeStatus">
import { provide } from 'vue';
import statusValueVue from '../status/statusValue/statusValue.vue';
import textAreaVue from '@/components/other/textArea/textArea.vue';
	let {status} = defineProps(["status"])
	console.log(status)
	let emits = defineEmits(["deleteStatus"])
	provide("status",status)
	function deleteStatus(){
		emits('deleteStatus')
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