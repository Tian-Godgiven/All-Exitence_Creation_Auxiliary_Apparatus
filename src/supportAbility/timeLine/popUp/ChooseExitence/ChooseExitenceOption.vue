<template>
    <div>{{item.name}}</div>
    <Selector
        @change="onChange" 
        @click.stop
        v-if="optionList.length>0" 
        v-model="item.targetStatus.key"
        :list="optionList"
    />
</template>

<script setup lang='ts'>
    import { computed, watch } from 'vue';
    import { TItem,EItem } from './chooseExitence';
    import Selector from '@/components/global/Selector.vue';

    const {item,parent} = defineProps<{
        item:EItem|TItem,
        parent?:TItem
    }>()
    type Option = {
        label:string,
        value:string //为该属性的key
    }
    //选项列表:该对象的时间属性+额外属性中符合条件的部分
    const optionList = computed(()=>{
        if(!item.timeStatus)return []
        //分类选择的属性
        const pTargetStatus = parent?.targetStatus
        //该事物的可选属性列表
        const statusList:Option[] = item.timeStatus.flatMap((status)=>{
            //不包含其分类当前所选择的时间属性
            if(pTargetStatus && status.__key == pTargetStatus.key){
                return []
            }
            return {
                value:status.__key as string, 
                label:status.name as string,
            }
        })
        if(statusList.length > 0){
            //如果分类有可选属性，则添加上继承分类属性的选项
            if(pTargetStatus){
                statusList.unshift({
                    value:"inherit",
                    label:"继承分类"
                })
            }
        }
        return statusList
    })
    //默认选择第一个选项
    watch(optionList,()=>{
        if(optionList.value.length > 0){
            //设置为默认选项(第一个选项)
            item.targetStatus.key = optionList.value[0].value
        }
    },{
        immediate:true
    })
    
    function onChange(){
        //填充其余的属性
        const key = item.targetStatus.key
        //继承
        if(key == "inherit"){
            item.targetStatus = {
                key,
                name:"继承属性",
                time:0
            }
        }
        //找到这个属性的其他数据
        else{
            const status = item.timeStatus.find(status=>status.__key == key)
            if(status){
                item.targetStatus = {
                    key,
                    name:status.name as string,
                    time:status.value
                }
            }
        }
        
        //改变选择时，还会改变其事物选择的属性
        if('child' in item){
            const targetStatus = item.targetStatus;
            item.child.forEach((child)=>{
                //分组的情况
                if('child' in child){
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