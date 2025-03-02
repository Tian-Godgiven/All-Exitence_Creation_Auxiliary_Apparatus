<template>
<div class="chooseInAllExitence chooseList">
    <ChooseInNode v-for="type in typeList" 
        :chosenList="chosenList" 
        :children="getChildrenList(type)">
        <template #parent>
            <div class="type">{{ type.name }}</div>
        </template>
        <template #children="{child,state}">
            <!-- 选择目标为分组 -->
            <div v-if="targetType=='group'" class="group">{{ child.name }}</div>
            <!-- 选项目标为事物 -->
            <ChooseInNode v-if="child?.rules && targetType=='exitence'" 
                :chosen-list="chosenList" 
                :idle-parent-state="state" 
                :children="getExitenceInGroup(type,child)">
                <template #parent>
                    <div class="group">{{ child.name }}</div>
                </template>
                <template #children="{child:child2}">
                    <div class="exitence">{{ child2.name }}</div>
                </template>
            </ChooseInNode>
            <div v-else v-if="ifShowExitence" class="exitence">
                {{ child.name }}
            </div>
        </template>
    </ChooseInNode>

    <div>
        <div @click="confirm">确认</div>
        <div>返回</div>
    </div>
</div>
</template>

<script setup lang='ts'>
import { Group } from '@/class/Group';
import { Type } from '@/class/Type';
import ChooseInNode from '@/components/other/chooseInTree/ChooseInNode.vue';
import { getExitenceInGroup, getNoGroupExitence, nowAllExitence } from '@/hooks/all-exitence/allExitence';
import { PopUp } from '@/hooks/pages/popUp';
import { computed, Ref, ref } from 'vue';
    const {props,returnValue,popUp} = defineProps<{props:Record<string,any>,returnValue:()=>void,popUp:PopUp}>()
    type Props = {
            targetType:"exitence"|"group", //选择类型
            //选择范围，对应1.所有，2.指定分类，3.指定的多个分类，4.多个【指定分类中的指定分组】
            chooseRange:"all"|Type|Type[]
            showGroup?:boolean,
            maxNum?:number,
            minNum?:number
        }|{
            targetType:"type",
            chooseRange:"all"|Type[],
            showGroup?:false,
            maxNum?:number,
            minNum?:number
    }
    const {targetType,chooseRange,showGroup=true,maxNum=null,minNum=null} = props as Props


    //获取显示的分类列表
    const typeList = computed<Type[]>(()=>{
        if(chooseRange == "all"){
            return nowAllExitence.types
        }
        //单个分类
        if(chooseRange instanceof Type){
            return [chooseRange]
        }
        //多个分类/+分组
        return chooseRange
    }) 

    //是否显示分组
    const ifShowGroup = computed(()=>{
        if(targetType == "type"){
            return false
        }
        return showGroup
    })
    //是否显示事物
    const ifShowExitence = computed(()=>{
        if(targetType == "exitence"){
            return true
        }
        return false
    })

    //获取子元素列表
    function getChildrenList(type:Type){
        //如果只显示分组，则子元素仅为分组
        if(targetType=="group"){
            return type.groups
        }
        //如果显示分组，则子元素包含分组+没有分组的事物
        if(ifShowGroup.value){
            const tmp = [
                ...type.groups, //分组
                ...getNoGroupExitence(type) //没有分组的事物
            ]
            return tmp
        }
        //如果不显示分组，则只包含事物
        else{
            return type.exitence
        }
    }

    //已选择列表
    const chosenList:any[] = []
    //确认
    function confirm(){
        //获得选中的所有目标
        console.log(chosenList)
        returnValue()
    }
</script>

<style scoped lang='scss'>

</style>