<template>
<div class="chooseExitence">
    <div class="chooseTimeRule">选择时间规则
        <ElSelect v-model="timeRule">
            <ElOption v-for="item in timeRuleList" 
                :value="item.value"
                :label="item.label"/>
        </ElSelect>
    </div>

    <div class="chooseList">
        <SwitchExpand class="type" v-for="type in list">
            <template #title>
                <ChooseInNode :item="type">
                    <ChooseExitenceOption :item="type"/>
                </ChooseInNode>
            </template>
            <template #inner>
                <div v-for="child in type.child">
                    <!-- 分组 -->
                    <SwitchExpand v-if="child.child" class="group">
                        <template #title>
                            <ChooseInNode :item="child" :parent="type">
                                {{ child.name }}
                            </ChooseInNode>
                        </template>
                        <template #inner>
                            <ChooseInNode v-for="exitence in child.child" :item="exitence" :parent="child">
                                <ChooseExitenceOption :item="exitence" :parent="type"/>
                            </ChooseInNode>
                        </template>
                    </SwitchExpand>
                    <!-- 事物 -->
                    <ChooseInNode v-else
                        :parent="type"
                        :item="child">
                        <ChooseExitenceOption :item="child" :parent="type"/>
                    </ChooseInNode>
                </div>
            </template>
        </SwitchExpand>
    </div>

    <div class="finalButtons">
        <Button @click="confirm" name="确认"></Button>
        <Button @click="closePopUp(popUp)" name="取消"></Button>
    </div>
</div>
</template>

<script setup lang='ts'>

import ChooseInNode from '@/components/other/chooseInTree/ChooseInNode.vue';
import { closePopUp, PopUp } from '@/hooks/pages/popUp';
import { computed, ref } from 'vue';
import Button from '@/components/global/button.vue';
import { ElOption, ElSelect } from 'element-plus';
import { getList, getSelectionExitence, getTimeRuleList } from './chooseExitence';
import ChooseExitenceOption from './ChooseExitenceOption.vue';
import SwitchExpand from '@/components/other/SwitchExpand.vue';

    const {returnValue,popUp} = defineProps<{returnValue:(chosenList:any[])=>void,popUp:PopUp}>()
    
    const list = computed(()=>{
        return getList(timeRule.value)
    })

    //可选择的时间规则列表，默认选项为data(日期)
    const timeRuleList = computed(()=>{
        return getTimeRuleList()
    })
    //当前选中的时间规则
    const timeRule = ref<string>("date")
    
    //确认
    function confirm(){
        //获得选中的所有事物
        const chosenList = getSelectionExitence(list.value)
        returnValue(chosenList)
        closePopUp(popUp)
    }
</script>

<style scoped lang='scss'>
    @use "@/static/style/popUp.scss";
    .finalButtons{
        @extend .finalButtons;
    }
</style>