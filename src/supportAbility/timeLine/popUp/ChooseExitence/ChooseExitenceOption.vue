<template>
    <div>{{item.name}}</div>
    <ElSelect @change="onChange" 
        @click.stop 
        v-if="optionList.length>0" 
        v-model="item.targetStatus">
        <ElOption v-for="option in optionList" 
            :value="option.value"
            :label="option.label"/>
    </ElSelect>
</template>

<script setup lang='ts'>
    import { computed } from 'vue';
    import { Item } from './chooseExitence';
import { ElOption, ElSelect } from 'element-plus';

    const {item,parent} = defineProps<{item:Item,parent?:Item}>()
    //选项列表:该对象的时间属性+额外属性中符合条件的部分
    const optionList = computed<{label:string,value:string}[]>(()=>{
        if(!item.timeStatus)return []
        //分类选择的属性
        const pTargetStatus = parent?.targetStatus
        //该事物的属性列表
        const statusList = item.timeStatus.flatMap((status)=>{
            //1.不为其分类当前所选择的时间属性
            
            if(pTargetStatus && status.__key == pTargetStatus){
                return []
            }
            //2.与当前已选择的时间规则相同
            return {
                value:status.__key as string, 
                label:status.name as string
            }
        })
        if(statusList.length > 0){
            //如果分类已经选择了属性，则添加上继承分类属性的选项
            if(pTargetStatus){
                statusList.unshift({
                    value:"inherit",
                    label:"继承分类"
                })
            }
            item.targetStatus = statusList[0].value
        }
        return statusList
    })
    //改变选择时，还会改变其事物选择的属性
    function onChange(){
        if(item.child){
            const targetStatus = item.targetStatus;
            item.child.forEach((child)=>{
                //分组的情况
                if(child.child){
                    child.child.forEach((exitence)=>{
                        exitence.targetStatus = targetStatus
                    })
                }
                else{
                    child.targetStatus = targetStatus
                }
            })
        }
    }

</script>

<style scoped lang='scss'>

</style>