<template>
    <div class="setExitence">
        <settingBoxVue :show="true" ref="settingBox"
            :target="tmpExitence"
            :chooseTarget="[type]"
            :optionList="exitenceSettingList"
            :settingValue/>
        <FinalButtons :buttons="[
            {click:confirm,name:'确认'},
            {click:()=>closePopUp(popUp),name:'取消'}]"/>
    </div>
</template>

<script setup lang='ts'>
    import { showQuickInfo } from '@/api/showQuickInfo';
    import settingBoxVue from '@/components/all-exitence/setting/settingBox.vue';
    import { exitenceSettingList } from '@/static/list/settingList/exitenceSettingList';
    import { closePopUp } from '@/hooks/pages/popUp';
    import { cloneDeep } from 'lodash';
    import { useTemplateRef } from 'vue';
    import FinalButtons from '@/app/stacks/popUp/FinalButtons.vue';
import { Exitence } from '@/class/Exitence';
import { Type } from '@/class/Type';
    const {props,popUp,returnValue} = defineProps(["props","popUp","returnValue"])
    const {exitence,type}:{
        exitence:Exitence,
        type:Type
    } = props
    //临时的修改对象
    const tmpExitence = cloneDeep(exitence)
    //设置箱
    const settingBox = useTemplateRef("settingBox")
    const settingValue = {...type.setting,...exitence.setting}
    //确认时，返回这样一个修改对象
    function confirm(){
        // 要求属性设置合理
		if(!settingBox.value?.checkSet()){
			showQuickInfo("属性设置不正确")
			return false
		}
        returnValue(tmpExitence)
        closePopUp(popUp)
    }
</script>

<style scoped lang='scss'>

</style>