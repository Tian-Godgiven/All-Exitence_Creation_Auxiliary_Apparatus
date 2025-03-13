<template>
<div class="chooseArticle">
    <div class="chooseTime">
        <ElSelect v-model="targetStatus">
            <ElOption v-for="item in targetStatusList"
                :value="item.value"
                :label="item.label"/>
        </ElSelect>
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
import { getList, getSelectedArticles } from './chooseArticle';
import { ElOption, ElSelect } from 'element-plus';
import { ref } from 'vue';
import ChooseArticleOption from './ChooseArticleOption.vue';
import Button from '@/components/global/button.vue';
    const {popUp,returnValue} = defineProps<{popUp:PopUp,returnValue:(targetStatus:string,list:{sourceKey:string[],targetKey:string[]}[])=>void}>()
    //选择作为目标属性的文章事件
    const targetStatusList = [
        {value:"createTime",label:"创建时间"},
        {value:"updateTime",label:"更新时间"}
    ]
    const targetStatus = ref("updateTime")
    //文章选项列表
    const list = getList()
    function confirm(){
        //获取选中的文章
        const chosenList = getSelectedArticles(list)
        returnValue(targetStatus.value,chosenList)
        closePopUp(popUp)
    }
</script>

<style scoped lang='scss'>
@use "@/static/style/popUp.scss";
    .finalButtons{
        @extend .finalButtons;
    }
</style>