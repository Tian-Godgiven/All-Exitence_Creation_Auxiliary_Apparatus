<template>
<div class="chooseInAllExitence">
    <div class="chooseList">
        <ChooseInNode v-for="item in list" :item="item"></ChooseInNode>
    </div>

    <div class="finalButtons">
        <Button @click="confirm" name="确认"></Button>
        <Button @click="closePopUp(popUp)" name="取消"></Button>
    </div>
</div>
</template>

<script setup lang='ts'>
import { Group } from '@/class/Group';
import { Type } from '@/class/Type';
import ChooseInNode from '@/components/other/chooseInTree/ChooseInNode.vue';
import { getExitenceInGroup, getNoGroupExitence, nowAllExitence } from '@/hooks/all-exitence/allExitence';
import { closePopUp, PopUp } from '@/hooks/pages/popUp';
import { computed, reactive } from 'vue';
import Button from '@/components/global/button.vue';
    const {props,returnValue,popUp} = defineProps<{props:Record<string,any>,returnValue:(chosenList:any[])=>void,popUp:PopUp}>()
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
    const {targetType,chooseRange,showGroup=true} = props as Props
    
    type Item = {
        target:any,
        state:boolean,
        child?:Item[]
    }
    const list = computed(()=>{
        return getList()
    })
    //获取需要显示的列表，其中包含自身状态和子元素
    function getList():Item[]{
        //帮助函数：使用分组创建基础列表项
        function createListItemWithGroup(type:Type,group:Group){
            const exitenceList = getExitenceInGroup(type,group)
            return {
                target:group,
                state:false,
                child:createListItemWithArr(exitenceList)
            }
        }
        //分类列表
        const typeList = function(){
            if(chooseRange == "all"){
                return nowAllExitence.types
            }
            //单个分类
            if(chooseRange instanceof Type){
                return [chooseRange]
            }
            //多个分类
            return chooseRange
        }() 
        let list:Item[]
        switch(targetType){
            //选项为分类
            case "type":
                list = createListItemWithArr(typeList)
                break;
            //选项为分类
            case "group":
                list = typeList.map((type)=>{
                    return {
                        target:type,
                        state:false,
                        child:createListItemWithArr(type.groups)
                    }
                })
                break;
            //选项为事物
            case "exitence":
                //不显示分组:直接由事物组成
                if(!showGroup){
                    list = typeList.map((type)=>{
                        return {
                            target:type,
                            state:false,
                            child:createListItemWithArr(type.exitence)
                        }
                    })
                }
                //显示分组
                list = typeList.map((type)=>{
                    const noGroupList = getNoGroupExitence(type)
                    return {
                        target:type,
                        state:false,
                        child:[
                        //分组+分组中的事物
                        ...type.groups.map((group)=>{
                            return createListItemWithGroup(type,group)
                        }),
                        //还要包含没有在分组中的事物
                        ...createListItemWithArr(noGroupList)]
                    }
                })
                
        }

        return reactive(list)
    }
    //使用数组创建基础列表项
    function createListItemWithArr(arr:any[]){
        return arr.map((item)=>{
            return {
                target:item,
                state:false
            }
        })
    }
    //确认
    function confirm(){
        //获得选中的所有目标类型(最终子类型)
        const chosenList:Item[] = []
        //辅助递归函数
        function traverse(items: Item[]): void {
            for (let item of items) {
                // 如果没有 `child` 属性，或者 `child` 是空数组
                if (!item.child || item.child.length === 0) {
                    if(item.state == true){
                        chosenList.push(item.target);
                    }
                } else if (item.child && item.child.length > 0) {
                    // 如果有子节点，递归遍历
                    traverse(item.child);
                }
            }
        }
        traverse(list.value)
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