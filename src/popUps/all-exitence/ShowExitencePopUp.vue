<template>
<TargetContainer title-align="left" :if-info="false">
    <template #title>
        <div class="title">{{ exitence.name }}</div>
    </template>
	<template #topBar>
		<div class="buttons">
            <Button name="跳转至事物" @click="clickJumpToExitence" icon="showOnMain"></Button>
            <Button @click="closePopUp(popUp)" icon="closePopUp"></Button>
        </div>
	</template>
    <template #inner ref="inner">
        <ExitenceStatus
            v-for="status in exitence.status" 
            :disabled="true"
            :fullStatus="getFullStatusOfExitence(type,status).value"
            :status
            :exitence
            :key="status.__key"/>
        <div class="scrollSpace"></div>
    </template>
</TargetContainer>
</template>

<script setup lang='ts'>
import ExitenceStatus from '@/components/all-exitence/exitence/ExitenceStatus.vue';
import { showTargetOnMain } from '@/hooks/pages/mainPage/showOnMain';
import { closePopUp, PopUp } from '@/hooks/pages/popUp';
import { Type } from '@/class/Type';
import TargetContainer from '@/app/pages/mainPage/components/TargetContainer.vue';
import { Exitence } from '@/class/Exitence';
import Button from '@/components/global/Button.vue';
import { getFullStatusOfExitence } from '@/hooks/all-exitence/status';
    const {props,popUp} = defineProps<{
        props:{
            type:Type,
            exitence:Exitence
        },
        popUp:PopUp
    }>()
    const {type,exitence} = props

    function clickJumpToExitence(){
        closePopUp(popUp)
        showTargetOnMain({type:"exitence",target:exitence})
    }
</script>

<style scoped lang='scss'>
.title{
    width: 100%;
}
.buttons{
    height: 50px;
    display: flex;
    gap: 5px;
    .button{
        aspect-ratio: 1;
        height: 100%;
    }
}
.scrollSpace{
    width: 100%;
    height: 30%;
}
</style>