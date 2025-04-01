<template>
    <div>{{item.name}}</div>
    <Selector
        @change="onChange" 
        @click.stop
        v-if="optionList.length>0" 
        v-model="item.targetStatus"
        :list="optionList"
    />
</template>

<script setup lang='ts'>
    import { computed } from 'vue';
    import { TItem,EItem } from './chooseExitence';
import Selector from '@/components/global/Selector.vue';

    const {item,parent} = defineProps<{item:EItem|TItem,parent?:TItem}>()
    //选项列表:该对象的时间属性+额外属性中符合条件的部分
    const optionList = computed<{label:string,value:{time:number,key:string,name:string}}[]>(()=>{
        if(!item.timeStatus)return []
        //分类选择的属性
        const pTargetStatus = parent?.targetStatus
        //该事物的可选属性列表
        const statusList = item.timeStatus.flatMap((status)=>{
            //不为其分类当前所选择的时间属性
            if(pTargetStatus && status.__key == pTargetStatus.key){
                return []
            }
            return {
                value:{
                    key:status.__key as string,
                    time:status.value,
                    name:status.name as string
                }, 
                label:status.name as string,
            }
        })
        if(statusList.length > 0){
            //如果分类已经选择了属性，则添加上继承分类属性的选项
            if(pTargetStatus){
                statusList.unshift({
                    value:{
                        key:"inherit",
                        time:null,
                        name:""
                    },
                    label:"继承分类"
                })
            }
            //设置为默认选项(第一个选项)
            item.targetStatus = statusList[0].value
        }
        return statusList
    })
    //改变选择时，还会改变其事物选择的属性
    function onChange(){
        if('child' in item){
            console.log("改变子元素了",item)
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