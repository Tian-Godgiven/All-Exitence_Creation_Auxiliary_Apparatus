<template>
    <div class="setType">
        <settingBoxVue
            :show="true"
            ref="settingBox"
            :target="tmpType"
            :optionList="typeSettingList"
            :settingValue="tmpType.setting"/>
        <FinalButtons :buttons="[
            {click:confirm,name:'确认'},
            {click:()=>closePopUp(popUp),name:'取消'}]"/>
    </div>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash'
import { useTemplateRef } from 'vue'
import { Type } from '@/class/Type'
import { showQuickInfo } from '@/api/showQuickInfo'
import settingBoxVue from '@/components/all-exitence/setting/settingBox.vue'
import { typeSettingList } from '@/static/list/settingList/typeSettingList'
import FinalButtons from '@/app/stacks/popUp/FinalButtons.vue'
import { closePopUp } from '@/hooks/pages/popUp'

const { props, popUp, returnValue } = defineProps(['props','popUp','returnValue'])
const { type }:{type:Type} = props
const tmpType = cloneDeep(type)
const settingBox = useTemplateRef('settingBox')

function confirm(){
    if(!settingBox.value?.checkSet()){
        showQuickInfo('分类设置不正确')
        return false
    }
    returnValue(tmpType.setting)
    closePopUp(popUp)
}
</script>
