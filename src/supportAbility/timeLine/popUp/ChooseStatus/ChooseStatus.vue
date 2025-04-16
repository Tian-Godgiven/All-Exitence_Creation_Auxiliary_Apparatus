<template>
<div class="chooseStatus"></div>
    <div class="chooseList">
        <SwitchExpand v-for="type in list">
            <template #title>
                <div>{{ type.name }}</div>
            </template>
            <template #inner>
                <div v-for="child in type.child">
                    <!-- 分组 -->
                    <SwitchExpand v-if="'child' in child">
                        <template #title>
                            <div>{{ child.name }}</div>
                        </template>
                        <template #inner>
                            <ChooseStatusOption v-for="item in child.child" :item="item"></ChooseStatusOption>
                        </template>
                    </SwitchExpand>
                    <div v-else>
                        <ChooseStatusOption :item="child"></ChooseStatusOption>
                    </div>
                </div>
            </template>
        </SwitchExpand>
    </div>
    <FinalButtons :buttons="[
        {click:confirm,name:'确认'},
        {click:()=>closePopUp(popUp),name:'取消'}]"></FinalButtons>
</template>

<script setup lang='ts'>
import { getChosenKey, getList } from './chooseStatus';
import SwitchExpand from '@/components/other/SwitchExpand.vue';
import ChooseStatusOption from './ChooseStatusOption.vue';
import { closePopUp, PopUp } from '@/hooks/pages/popUp';
import { showQuickInfo } from '@/api/showQuickInfo';
import FinalButtons from '@/app/stacks/popUp/FinalButtons.vue';
    const {popUp,returnValue} = defineProps<{popUp:PopUp,returnValue:(key:{sourceKey:[string,string],targetKey:string})=>{}}>()
    const list = getList()
    //返回选择的事物与选择的属性
    function confirm(){
        const key = getChosenKey()
        if(key){
            returnValue(key)
            closePopUp(popUp)
        }
        else{
            showQuickInfo("点击选择事物与属性")
        }
        
        
    }
</script>

<style scoped lang='scss'>
</style>