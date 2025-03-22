<template>
<div>
    <div class="row">
        <div>分类</div>
        <div>事物</div>
        <div>属性</div>
    </div>
    <div class="table" v-for="type in targets">
        <div class="row" v-for="i in type.exitence.length">
            <div>{{ i == 1? type.name:"" }}</div>
            <div>{{ type.exitence[i-1].name }}</div>
            <div>{{ type.exitence[i-1].status.name }}</div>
            <Button icon="delete" name="删除" @click="deleteTarget(type,i-1)"></Button>
        </div>
    </div>
</div>
</template>

<script setup lang='ts'>
import Button from '@/components/global/Button.vue';
import { TargetList } from './chooseExitence';
    const {targets} = defineProps<{targets:TargetList}>()
    function deleteTarget(type:TargetList[number],i:number){
        const typeIndex = targets.indexOf(type)
        //删除事物
        targets[typeIndex].exitence.splice(i,1)
        if(targets[typeIndex].exitence.length==0){
            targets.splice(typeIndex,1)
        }
    }
</script>

<style scoped lang='scss'>
.row{
    display: grid;
    grid-template-columns: 1fr 0.8fr 1fr 40px;
    >div{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .icon{
        width: 40px;
        height: 40px;
    }
}
</style>