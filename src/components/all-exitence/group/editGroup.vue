<template>
<div class="editGroup">
    <div class="top">
        <DownLineInput
            v-model="group.name"
            class="groupName"
            placeholder="输入分组名称"/>
    </div>

    <div class="inner">
        <RuleList :group></RuleList>
        <Selector v-model="ruleLinker" placeholder="请选择" :list="ruleLinkerList"/>
        <NewGroupRule @createGroupRule="createNewRule" ></NewGroupRule>
    </div>
</div>
</template>

<script setup lang='ts'>
    import { ref} from 'vue';
    import DownLineInput from '@/components/other/input/downLineInput.vue';
    import NewGroupRule from '@/components/all-exitence/group/newGroupRule.vue';
    import RuleList from './RuleList.vue';
    import Selector from '@/components/global/Selector.vue';
    import { Group } from '@/class/Group';

    const {group} = defineProps<{group:Group}>()

    //分组规则连接符号
    const ruleLinker = ref("&&")
    const ruleLinkerList = [
        {label:"并且",value:"&&"},
        {label:"或者",value:"||"},
        {label:"取反/否定",value:"!"}
    ]
    //创建新的分组规则
    function createNewRule(newRule:string){
        //将分组规则连接符号放在前面
        const rule = ruleLinker.value + newRule
        //将新的分组规则添加到分组中
        group.rules.push(rule)
    }
</script>

<style scoped lang='scss'>
.editGroup{
    .top{
        display: flex;
        height: 100px;
        position: relative;
        .groupName{
            position: relative;
            top:-20px;
            margin-top:auto;
            font-size: 1.4rem;
            width: 550px;
            height: 60px;
        }
    }
}
</style>