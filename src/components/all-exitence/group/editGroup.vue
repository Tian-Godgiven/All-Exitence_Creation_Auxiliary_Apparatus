<template>
    <div class="editGroup">
        <div class="top">
            <downLineInputVue 
				v-model="group.name"
				class="groupName"
				placeholder="输入分组名称"/>
        </div>

        <div class="inner">
            <!-- 已存在的分组规则 -->
            <div class="groupRules">
                <draggableListVue :list="group.rules" v-slot="{element:rule,index}">
                    <groupRuleVue 
                        :key="Symbol()"
                        :rule="rule"
                        @deleteRule="deleteRule(index)"/>
                </draggableListVue>
            </div>

            <!-- 连接分组规则，默认为并且 -->
            <Selector v-model="ruleLinker" placeholder="请选择" :list="ruleLinkerList"/>

            <!-- 创建新的分组规则 -->
            <newGroupRuleVue @createGroupRule="createNewRule" ></newGroupRuleVue>
            
        </div>
    </div>
</template>

<script setup lang='ts'>
    import { ref} from 'vue';
    import downLineInputVue from '@/components/other/input/downLineInput.vue';
    import newGroupRuleVue from '@/components/all-exitence/group/newGroupRule.vue';
    import draggableListVue from '@/components/other/draggableList/draggableList.vue';
    import groupRuleVue from '@/components/all-exitence/group/groupRule.vue';
import Selector from '@/components/global/Selector.vue';
    
    const group = defineModel<any>()

    //分组规则连接符号
    const ruleLinker = ref("&&")
    const ruleLinkerList = [
        {label:"并且",value:"&&"},
        {label:"或者",value:"||"},
        {label:"取反/否定",value:"!"}
    ]

    //删除已有的分组规则
    function deleteRule(index:number){
        group.value.rules.splice(index,1)
    }

    //创建新的分组规则
    function createNewRule(newRule:string){
        //将分组规则连接符号放在前面
        const rule = ruleLinker.value + newRule
        //将新的分组规则添加到分组中
        group.value.rules.push(rule)
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