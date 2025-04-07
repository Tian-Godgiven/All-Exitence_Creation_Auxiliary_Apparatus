<template>
<div class="chooseExitence">
    <div class="chooseTimeRule">选择时间规则
        <Selector v-model="timeRuleKey" :list="timeRuleList"/>
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
                    <SwitchExpand v-if="'child' in child" class="group">
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
import Button from '@/components/global/Button.vue';
import { getList, getSelectionExitence, getTimeRuleList } from './chooseExitence';
import ChooseExitenceOption from './ChooseExitenceOption.vue';
import SwitchExpand from '@/components/other/SwitchExpand.vue';
import Selector from '@/components/global/Selector.vue';
import { returnValue_Exitence } from '../editTimeLine/editTimeLine';

    const {popUp} = defineProps<{popUp:PopUp}>()
    
    const list = computed(()=>{
        return getList(timeRuleKey.value)
    })

    //可选择的时间规则列表，默认选项为data(日期)
    const timeRuleList = computed(()=>{
        return getTimeRuleList()
    })
    //当前选中的时间规则的key
    const timeRuleKey = ref<string>("date")
    
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
    @use "@/static/style/popUp.scss";
    .finalButtons{
        @extend .finalButtons;
    }
</style>