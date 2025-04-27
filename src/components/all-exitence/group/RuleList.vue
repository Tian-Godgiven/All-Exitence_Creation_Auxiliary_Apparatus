<template>
<DraggableList class="groupRules" 
    :list="group.rules" 
    :dragHandle="true" 
    v-slot="{item:rule}"> 
    <div class="item">
        <GroupRule class="rule" :rule="rule"/>
        <Button name="删除" @click="deleteRule(rule)" icon="delete"></Button>
    </div>
</DraggableList>
</template>

<script setup lang='ts'>
    import DraggableList from '@/components/other/DraggableList.vue';
import Button from '@/components/global/Button.vue';
import GroupRule from '@/components/all-exitence/group/GroupRule.vue';
import { Group } from '@/class/Group';
    const {group} = defineProps<{group:Group}>()
    //删除已有的分组规则
    function deleteRule(rule:string){
        const index = group.rules.indexOf(rule)
        group.rules.splice(index,1)
    }
</script>

<style scoped lang='scss'>
.item{
    padding: 5px 10px;
    display: flex;
    align-items: center;
    .rule{
        flex-grow: 1;
    }
    .button{
        width: 50px;
        height: 50px;
    }
}
</style>