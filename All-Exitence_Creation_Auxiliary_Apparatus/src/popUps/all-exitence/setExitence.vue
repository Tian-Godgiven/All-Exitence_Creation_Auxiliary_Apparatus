<template>
    <div class="setExitence">
        <div>
            <settingBoxVue ref="settingBox"></settingBoxVue>
        </div>
        <div class="buttons">
            <div class="button" @click="confirm">确认</div>
            <div class="button" @click="closePopUp(popUp)">取消</div>
        </div>
    </div>
</template>

<script setup lang='ts'>
    import { showQuickInfo } from '@/api/showQuickInfo';
import settingBoxVue from '@/components/all-exitence/setting/settingBox.vue';
    import { exitenceSettingList } from '@/data/list/settingList/exitenceSettingList';
import { closePopUp } from '@/hooks/pages/popUp';
import { cloneDeep } from 'lodash';
    import { ref, provide } from 'vue';
    const {props,popUp,returnValue} = defineProps(["props","popUp","returnValue"])
    const {exitence,type} = props
    //临时修改的对象
    const tmpExitence = cloneDeep(exitence)
    //设置箱
    const settingBox = ref()
    
    const settingProps = {
        target:tmpExitence,
        chooseTarget:[type],
        optionList:exitenceSettingList,
        settingValue:{...type.setting,...exitence.setting}
    }
    provide("settingProps",settingProps)

    //返回这个设置值
    function confirm(){
        // 要求属性设置合理
		if(!settingBox.value.checkSet()){
			showQuickInfo("属性设置不正确")
			return false
		}
        returnValue(tmpExitence.setting)
        closePopUp(popUp)
    }
</script>

<style scoped lang='scss'>
@use "@/static/style/components/popUpButtons.scss";
    .bottom{
		@extend .buttons;
	}
</style>