<template>
    <div class="createGroup">

        <div class="top">
            <downLineInputVue 
				v-model="newGroup.name"
				class="groupName"
				placeholder="输入分组名称"/>
        </div>

        <div class="inner">
            <!-- 已存在的分组规则 -->
            <div class="groupRules">
                <groupRuleVue v-for="rule in newGroup.rules" :rule="rule"></groupRuleVue>
            </div>

            <!-- 连接分组规则，默认为并且 -->
            <div>
                <ElSelect
                    v-model="ruleLinker"
                    placeholder="请选择">
                    <ElOption
                        v-for="item in ruleLinkerList"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"/>
                </ElSelect>
            </div>

            <!-- 创建新的分组规则 -->
            <newGroupRule></newGroupRule>

            
        </div>

        <div class="buttons">
            <div class="button" @click="confirm">确认</div>
            <div class="button" @click="closePopUp(popUp)">取消</div>
        </div>
    </div>
</template>

<script setup lang='ts'>
    import { closePopUp } from '@/hooks/popUp';
    import {provide, reactive, ref, toRaw } from 'vue';
    import downLineInputVue from '@/components/other/input/downLineInput.vue';
    import newGroupRule from '@/components/popUps/all-exitence/group/newGroupRule.vue';
    import { ElSelect, ElOption } from 'element-plus';
    import groupRuleVue from '@/components/popUps/all-exitence/group/groupRule.vue';
    const {props,popUp,returnValue} = defineProps(["props","popUp","returnValue"])
    //分组所在的分类
    const {type} = props
    provide("type",type)

    //新分组本身
    const newGroup = reactive({
        name:"",
        rules:[],
        setting:{}
    })

    //分组规则连接符号
    const ruleLinker = ref("&&")
    const ruleLinkerList = [
        {text:"并且",value:"&&"},
        {text:"或者",value:"||"},
        {text:"取反/否定",value:"!"}
    ]

    //点击确认返回该分组
    function confirm(){
        returnValue(toRaw(newGroup))
        closePopUp(popUp)
    }
</script>

<style scoped lang='scss'>
 @use "@/static/style/components/popUpButtons.scss";
    .createGroup{
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
    .buttons{
        @extend .buttons;
    }
</style>