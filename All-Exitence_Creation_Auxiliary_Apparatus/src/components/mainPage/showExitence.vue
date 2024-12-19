<template>
	<div class="container">
        <div class="targetTitle">
            <textAreaVue
                placeholder="输入名称"
                v-model="exitence.name"
                :inputSupport="true">
            </textAreaVue>
        </div>
        <div class="targetInner">
            <exitenceStatusVue 
				v-for="(status,index) in exitence.status" 
				:key='index'
				:status="status">
			</exitenceStatusVue>
        </div>
        <div class="targetInfo">属性数: {{statusNum}}</div>
    </div>
</template>

<script setup lang="ts" name="">
import { provide } from 'vue';
import textAreaVue from '@/components/other/textArea/textArea.vue';
import exitenceStatusVue from '../popUps/all-exitence/exitence/exitenceStatus.vue';
import { types } from '@/hooks/all-exitence/allExitence';	
import { Type } from '@/class/Type';
	let exitence = defineModel<any>()
	
	
	//事物所属的分类
	const type = types.find((type:Type)=>{
		if(type.name == exitence.value.typeName){
			return type
		}
    })
	
	//显示事物的属性数量
	const statusNum = exitence.value.status.length

	provide("type",type)//提供该事物所在的分类
	provide("allStatus",exitence.value.status)//提供所有属性
	provide("allTypeStatus",type.typeStatus)//提供所在的分类的所有属性

</script>

<style lang="scss" scoped>
	@use "@/static/style/mainPage.scss";
    .container{
        @extend .targetContainer;
		.targetTitle{
			text-align: left;
		}
    }
</style>