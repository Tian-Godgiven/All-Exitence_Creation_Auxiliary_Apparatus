<template>
<div class="chooseExitence">
    <div class="chooseTimeRule">选择时间规则
        <Selector v-model="timeRuleKey" :list="timeRuleList"/>
    </div>

    <ChooseExitenceInTree :list :exitenceData :groupData="{}" :typeData :ifGroup="true">
        <template #typeNode="{type}">
            <ChooseExitenceOption :item="type"/>
        </template>
        <template #groupNode="{group}">
            {{ group.name }}
        </template>
        <template #exitenceNode="{exitence,type}">
            <ChooseExitenceOption :item="exitence" :parent="type"/>
        </template>
    </ChooseExitenceInTree>

    <FinalButtons :buttons="[
        {click:confirm,name:'确认'},
        {click:()=>closePopUp(popUp),name:'取消'}]"></FinalButtons>
</div>
</template>

<script setup lang='ts'>

import { closePopUp, PopUp } from '@/hooks/pages/popUp';
import { computed, reactive, ref } from 'vue';
import { getSelectionExitence, getTimeRuleList, getList, ExitenceData, TypeData } from './chooseExitence';
import ChooseExitenceOption from './ChooseExitenceOption.vue';
import Selector from '@/components/global/Selector.vue';
import { returnValue_Exitence } from '../editTimeLine/editTimeLine';
import FinalButtons from '@/app/stacks/popUp/FinalButtons.vue';
import ChooseExitenceInTree from '@/components/other/chooseExitenceInTree/ChooseExitenceInTree.vue';
    
const {popUp} = defineProps<{popUp:PopUp}>()
    let exitenceData:ExitenceData
    let typeData:TypeData
    //可选择的时间规则列表，默认选项为data(日期)
    const timeRuleList = computed(()=>{
        return getTimeRuleList()
    })
    //当前选中的时间规则的key
    const timeRuleKey = ref<string>("date")

    //树列表
    const list = computed(()=>{
        const list = getList(timeRuleKey.value)
        return reactive(list)
    })
    //确认
    function confirm(){
        //获取选中的值
        const {targetList,minTimeValue} = getSelectionExitence(list.value)
        //执行返回函数
        returnValue_Exitence(targetList,timeRuleKey.value,minTimeValue)
        closePopUp(popUp)
    }
</script>

<style scoped lang='scss'>
</style>