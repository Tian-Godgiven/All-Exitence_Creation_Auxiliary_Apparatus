<template>
<div class="relationValue">
    <div class="relationTitle relationUnit" v-if="ifShowTitle" >
        <div class="titleUnit" 
            v-for="childStatus in relationSource">
            {{ childStatus.name }}
        </div>
    </div>
    <div class="relationAdd" @click="addUnit" v-if="ifShowAdd">[+]</div>
    <div class="relationUnits">
        <RelationUnit 
            v-for="unit,index of status.value" 
            :key="index"
            :target 
            :unit
            :source="relationSource"/>
    </div>
</div>
</template>

<script setup lang='ts'>
// 重要备注：模板的v-for中使用:key=index而不是Symbol()
// 是因为其中的statusValue组件有频繁的更新需求
// 使用Symbol()会导致依赖更新时刷新其中注入textarea等组件
    import { ref, watch } from 'vue';
import { Exitence, ExitenceStatus } from '@/class/Exitence';
import Status from '@/interfaces/Status';
import { getStatusSettingValue } from '@/hooks/all-exitence/status';
import { Type } from '@/class/Type';
import RelationUnit from './RelationUnit.vue';
    const {status,fullStatus,target} = defineProps<{
        status:Status|ExitenceStatus,
        fullStatus:Status,
        target:Type|Exitence
    }>()
    //获取关联源
    const relationSource = ref<Status[]>([])
    //是否显示新增按键:默认为true
    const ifShowAdd = ref<boolean>(true)
    //是否显示标题:默认为true
    const ifShowTitle = ref<boolean>(true)
    watch(()=>fullStatus.setting,()=>{
        relationSource.value = getStatusSettingValue<Status>(fullStatus.setting,"relationSource","arr")
            ??[]
        ifShowTitle.value = getStatusSettingValue(fullStatus.setting,"relationTitle","bool")
            ??true
        ifShowAdd.value = getStatusSettingValue(fullStatus.setting,"relationAdd","bool")
            ??true
    },{immediate:true})
    //添加空单元
    function addUnit(){
        status.value.push({})
    }
</script>

<style scoped lang='scss'>
    .relationValue{
        position: relative;
        .relationUnit{
            width: 100%;
            display: flex;
            flex-wrap: wrap; /* 允许子元素换行 */
            z-index: 1;
            .titleUnit{
                flex: 1 1 30%;
            }
        }
        .relationAdd{
            position: absolute;
            top:0px;
            width: 10%;
            right: 0px;
            z-index: 2;
        }
    }
    
</style>