<template>
<div class="chooseArticle">
    <div class="chooseTime">
        <Selector v-model="targetStatus" :list="targetStatusList"/>
    </div>
    <div class="chooseList">
        <ChooseArticleOption v-for="item in list" :item="item"/>
    </div>
    <div class="finalButtons">
        <Button @click="confirm" name="确认"></Button>
        <Button @click="closePopUp(popUp)" name="取消"></Button>
    </div>
</div>
</template>

<script setup lang='ts'>
import { PopUp,closePopUp } from '@/hooks/pages/popUp';
import { targetStatus, getList, getSelectionArticles } from './chooseArticle';
import ChooseArticleOption from './ChooseArticleOption.vue';
import Button from '@/components/global/Button.vue';
import {returnValue_Article} from '../CreateTimeLine/createTimeLine';

    const {popUp} = defineProps<{popUp:PopUp}>()
    //选择作为目标属性的文章事件
    const targetStatusList = [
        {value:"createTime",label:"创建时间"},
        {value:"updateTime",label:"更新时间"}
    ]
    
    //文章选项列表
    const list = getList()
    function confirm(){
        //获取选中的文章
        const {chosenList,minTime} = getSelectionArticles(list)
        returnValue_Article(chosenList,targetStatus.value,minTime)
        closePopUp(popUp)
    }
</script>

<style scoped lang='scss'>
@use "@/static/style/popUp.scss";
    .finalButtons{
        @extend .finalButtons;
    }
</style>