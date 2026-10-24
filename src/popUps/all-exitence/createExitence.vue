<template>
<div class="createExitence">
    <div class="top">
        <downLineInputVue 
            v-model="name"
            class="exitenceName"
            placeholder="输入事物名称"/>
    </div>

    <div class="inner">
        <div class="tags">
            <input type="checkbox" v-model="ifDefaultTags" @change="changeIfDefaultTags">
            <div class="text">标签<span v-show="ifDefaultTags">：</span></div>
            <StatusValue v-show="ifDefaultTags" 
                :status="defaultTagStatus" 
                :full-status="defaultTagStatus" 
                :target="tmpExitence"/>
        </div>

        <div class="setting">
            <settingBoxVue ref="settingBox"
                :target="tmpExitence"
                :chooseTarget="[type]"
                :optionList="exitenceSettingList"
                :settingValue/>
        </div>
    </div>

    <FinalButtons :buttons="[
        {click:confirm,name:'确认'},
        {click:()=>closePopUp(popUp),name:'取消'}]"/>
</div>
</template>

<script setup lang='ts'>
    import { reactive, ref, toRaw} from 'vue';
    import downLineInputVue from '@/components/other/input/downLineInput.vue';
    import { closePopUp } from '@/hooks/pages/popUp';
    import settingBoxVue from '@/components/all-exitence/setting/settingBox.vue';
    import { addExitence, createExitence } from '@/hooks/all-exitence/allExitence';
    import { exitenceSettingList } from '@/static/list/settingList/exitenceSettingList';
import { showQuickInfo } from '@/api/showQuickInfo';
import Status from '@/interfaces/Status';
import { nanoid } from 'nanoid';
import FinalButtons from '@/app/stacks/popUp/FinalButtons.vue';
import StatusValue from '@/components/all-exitence/status/StatusValue.vue';
    const {props, popUp, returnValue} = defineProps(["props","popUp","returnValue"])
    const name = ref("")
    const type = props.type

    //是否创建默认的标签属性
    const ifDefaultTags = ref(true)

    //默认的标签属性
    function changeIfDefaultTags(){
        //要创建则将事物设置中的预览属性在为空的情况下设置为该属性
        if(ifDefaultTags.value){
            //向临时事物内添加这个属性
            const index = tmpExitence.status.indexOf(defaultTagStatus)
            if(index == -1){
                tmpExitence.status.push(defaultTagStatus)
            }
            //为空才设置，不为空不覆盖
            if(!tmpExitence.setting.previewStatus){
                tmpExitence.setting.previewStatus = tagsKey
            }
        }
        //取消创建
        else{
            //从临时事物里删除这个属性
            const index = tmpExitence.status.indexOf(defaultTagStatus)
            tmpExitence.status.splice(index,1)
            tmpExitence.setting.previewStatus = null
        }
    }
    const tagsKey = nanoid()
    const defaultTagStatus:Status = reactive({
        name:"标签",
        value:[],
        valueType:"tags",
        setting:{},
        __key:tagsKey
    })

    //创建一个用于进行设置的临时事物
    const tmpExitence = reactive(createExitence(
        "",
        [defaultTagStatus],
        {previewStatus:tagsKey},
        type
    ))

    //分类设置：不为事物创建标签属性
    if(type.setting["noDefaultTags"] == true){
        ifDefaultTags.value = false
        changeIfDefaultTags()
    }

    const settingValue = {...type.setting,...tmpExitence.setting}
    const settingBox = ref()

    //确认创建
    function confirm(){
        //检查设置项的值
		if(!settingBox.value.checkSet()){
			showQuickInfo("事物设置不正确")
			return false
		}
        //改名并添加事物
        tmpExitence.name = name.value
        const exitence = addExitence(type,toRaw(tmpExitence))
        
        returnValue(exitence)
        closePopUp(popUp)
    }
</script>

<style scoped lang='scss'>
    .createExitence{
        width: 100%;
        height: 100%;
        min-height: 0;
        display: flex;
        flex-direction: column;
        :deep(.finalButtons){
            flex: 0 0 auto;
        }
    }
    .top{
        display: flex;
        flex: 0 0 100px;
        position: relative;
        .exitenceName{
            position: relative;
            top:-20px;
            margin-top:auto;
            font-size: 1.4rem;
            width: 550px;
            height: 60px;
        }
    }
    .inner{
        width: 100%;
        flex: 1 1 auto;
        min-height: 0;
        overflow: auto;
        .tags{
            display: flex;
            >.text{
                flex-shrink: 0;
            }
        }
        .setting{ width: 100%; }
    }
    @media (min-width: 900px){
        .top{
            flex: 0 0 auto;
        }
        .top .exitenceName{
            top: 0;
            margin-top: 0;
            width: min(100%, 420px);
            height: 44px;
        }
        .tags{
            align-items: center;
            gap: 8px;
            :deep(> .value){
                width: auto;
                min-width: 0;
                flex: 1 1 auto;
            }
        }
    }
</style>
