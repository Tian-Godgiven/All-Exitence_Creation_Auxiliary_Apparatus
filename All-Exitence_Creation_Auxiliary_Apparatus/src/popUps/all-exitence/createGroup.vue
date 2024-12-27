<template>
    <div class="createGroup">
        <editGroupVue v-model="newGroup"></editGroupVue>

        <div class="buttons">
            <div class="button" @click="confirm">确认</div>
            <div class="button" @click="closePopUp(popUp)">取消</div>
        </div>
    </div>
</template>

<script setup lang='ts'>
    import { closePopUp } from '@/hooks/pages/popUp';
    import {provide, reactive, toRaw } from 'vue';
    import editGroupVue from '@/components/popUps/all-exitence/group/editGroup.vue';
    import { showQuickInfo } from '@/api/showQuickInfo';
    import { addGroup } from '@/hooks/all-exitence/allExitence';
    const {props,popUp,returnValue} = defineProps(["props","popUp","returnValue"])
    //分组所在的分类
    const {type} = props
    provide("type",type)

    //新分组
    const newGroup = reactive({
        name:"",
        rules:[],
        setting:{}
    })

    //点击确认返回该分组
    function confirm(){
        //分类名称不可为空
		if(newGroup.name == "" || !newGroup.name){
			showQuickInfo("分组名不可为空")
			return false
		}
        //分组规则不能为空
        if(newGroup.rules.length == 0){
            showQuickInfo("分组需要至少一条规则")
            return false
        }
		//添加该分组
        addGroup(type,toRaw(newGroup))
        returnValue(newGroup)
		//关闭弹窗
        closePopUp(popUp)
    }
</script>

<style scoped lang='scss'>
 @use "@/static/style/components/popUpButtons.scss";
    .buttons{
        @extend .buttons;
    }
</style>