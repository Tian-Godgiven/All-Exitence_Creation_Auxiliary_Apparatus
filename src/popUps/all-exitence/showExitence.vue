<template>
<TargetContainer title-align="left" :if-info="false">
    <template #title>
        <div class="title">{{ exitence.name }}</div>
    </template>
	<template #topBar>
		<div class="buttons">
            <div class="button" @click="clickJumpToExitence">跳转至事物</div>
         </div>
	</template>
    <template #inner ref="inner">
        <ExitenceStatus
            v-for="status in exitence.status" 
            :disabled="true"
            :status
            :key="status.__key"/>
        <div class="scrollSpace"></div>
    </template>
</TargetContainer>
</template>

<script setup lang='ts'>
import { provide} from 'vue';
import ExitenceStatus from '@/components/all-exitence/exitence/ExitenceStatus.vue';
import { showTargetOnMain } from '@/hooks/pages/mainPage/showOnMain';
import { closePopUp, PopUp } from '@/hooks/pages/popUp';
import { Type } from '@/class/Type';
import TargetContainer from '@/app/pages/mainPage/components/TargetContainer.vue';
import { Exitence } from '@/class/Exitence';
    const {props,popUp} = defineProps<{
        props:{
            type:Type,
            exitence:Exitence
        },
        popUp:PopUp
    }>()
    const {type,exitence} = props
    
    provide("type",type)//提供该事物所在的分类
	provide("allStatus",exitence.status)//提供所有属性
	provide("allTypeStatus",type.typeStatus)//提供所在的分类的所有属性

    function clickJumpToExitence(){
        closePopUp(popUp)
        showTargetOnMain({type:"exitence",target:exitence})
    }
</script>

<style scoped lang='scss'>
.title{
    width: 100%;
}
.scrollSpace{
    width: 100%;
    height: 30%;
}
</style>