<template>
<div class="updateGroup">
    <editGroupVue v-model="tmpGroup"></editGroupVue>
    <FinalButtons :buttons="[
        {click:confirm,name:'确认'},
        {click:()=>closePopUp(popUp),name:'取消'}]"/>
</div>
</template>

<script setup lang='ts'>
    import { closePopUp } from '@/hooks/pages/popUp';
    import {provide ,reactive, toRaw} from 'vue';
    import editGroupVue from '@/components/all-exitence/group/editGroup.vue';
    import { showQuickInfo } from '@/api/showQuickInfo';
    import { cloneDeep } from 'lodash';
    import FinalButtons from '@/app/stacks/popUp/FinalButtons.vue';

    const {props,popUp,returnValue} = defineProps(["props","popUp","returnValue"])
    //分组所在的分类,已经分组本身
    const {type,group=null} = props
    provide("type",type)

    //创建一个group的深拷贝
    const tmpGroup = group ? reactive(cloneDeep(group)) : reactive({
        name:"",
        rules:[],
        setting:{}
    })

    //点击确认返回该分组
    function confirm(){
        //分类名称不可为空
		if(tmpGroup.name == "" || !tmpGroup.name){
			showQuickInfo("分组名不可为空")
			return false
		}
        //分组规则不能为空
        if(tmpGroup.rules.length == 0){
            showQuickInfo("分组需要至少一条规则")
            return false
        }
        
        //返回tmpGroup
        returnValue(toRaw(tmpGroup))
		//关闭弹窗
        closePopUp(popUp)
    }
</script>

<style scoped lang='scss'>
</style>