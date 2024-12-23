<template>
    <div class="createGroup">

        <div class="top">
            <downLineInputVue 
				v-model="groupName"
				class="groupName"
				placeholder="输入分组名称"/>
        </div>

        <div class="inner">
            <!-- 已存在的分组规则 -->
            <div class="groupRules">
                <groupRuleVue 
                    v-for="(rule,index) in groupRule" 
                    :key="Symbol()"
                    :rule="rule"
                    @deleteRule="deleteRule(index)"></groupRuleVue>
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
            <newGroupRuleVue @createGroupRule="createNewRule" ></newGroupRuleVue>

            
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
    import newGroupRuleVue from '@/components/popUps/all-exitence/group/newGroupRule.vue';
    import { ElSelect, ElOption } from 'element-plus';
    import groupRuleVue from '@/components/popUps/all-exitence/group/groupRule.vue';
    import { showQuickInfo } from '@/api/showQuickInfo';
    import { addGroup } from '@/hooks/all-exitence/allExitence';
    const {props,popUp,returnValue} = defineProps(["props","popUp","returnValue"])
    //分组所在的分类
    const {type} = props
    provide("type",type)

    //新分组
    const groupName = ref("")
    const groupRule= reactive<any[]>([])
    const groupSetting = reactive({})

    //分组规则连接符号
    const ruleLinker = ref("&&")
    const ruleLinkerList = [
        {text:"并且",value:"&&"},
        {text:"或者",value:"||"},
        {text:"取反/否定",value:"!"}
    ]

    //删除已有的分组规则
    function deleteRule(index:number){
        groupRule.splice(index,1)
    }

    //创建新的分组规则
    function createNewRule(newRule:string){
        //将分组规则连接符号放在前面
        const rule = ruleLinker.value + newRule
        //将新的分组规则添加到分组中
        groupRule.push(rule)
    }
    
    //点击确认返回该分组
    function confirm(){
        //分类名称不可为空
		if(groupName.value == "" || !groupName.value){
			showQuickInfo("分组名不可为空")
			return false
		}
        //分组规则不能为空
        if(groupRule.length == 0){
            showQuickInfo("分组需要至少一条规则")
            return false
        }
		//添加该分组
		const newGroup = {
            name:groupName.value,
            rules:toRaw(groupRule),
            setting:toRaw(groupSetting)
        }
        addGroup(type,newGroup)
        returnValue(newGroup)
		//关闭弹窗
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