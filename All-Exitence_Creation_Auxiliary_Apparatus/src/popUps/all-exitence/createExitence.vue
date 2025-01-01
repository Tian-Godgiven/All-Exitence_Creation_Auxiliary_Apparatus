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
                <div class="text">标签：</div>
                <tagsValueVue v-model="tags"/>
            </div>

            <div class="setting">
                <div class="button" @click="swicthShowSettingBox">事物设置</div>
                <settingBoxVue :show="showSettingBox" :ref="settingBox"/>
            </div>
        </div>
        
        <div class="buttons">
            <div class="button" @click="confirm">确认</div>
            <div class="button" @click="closePopUp(popUp)">取消</div>
        </div>
    </div>
</template>

<script setup lang='ts'>
    import { reactive, ref, toRaw, provide } from 'vue';
    import downLineInputVue from '@/components/other/input/downLineInput.vue';
    import { closePopUp } from '@/hooks/pages/popUp';
    import settingBoxVue from '@/components/all-exitence/setting/settingBox.vue';
    import { addExitence } from '@/hooks/all-exitence/allExitence';
    import tagsValueVue from '@/components/all-exitence/status/statusValue/tagsValue.vue';
    import { exitenceSettingList } from '@/data/list/exitenceSettingList';
    const {props, popUp, returnValue} = defineProps(["props","popUp","returnValue"])
    const name = ref("")
    const tags = reactive([])
    const type = props.type

    //用于进行设置的临时事物
    const tmpExitence = {
        status:type.typeStatus,
        setting:reactive({})
    }

    //设置相关
    const settingProps = {
        target:tmpExitence,//实际上修改的是事物对象的setting
        selectTarget:type,//用于筛选的是分类对象
        chooseTarget:[type],//必须传入一个数组
        optionList:exitenceSettingList,
        settingValue:type.setting
    }
    provide("settingProps",settingProps)
    //控制属性框显示
    const showSettingBox = ref(true)
    function swicthShowSettingBox(){
        showSettingBox.value = !showSettingBox.value
    }
    //属性框Vue
    const settingBox = ref()
    //确认创建
    function confirm(){
        //使用分类，名称，设置创建事物
        const exitence = addExitence(type,name.value,tmpExitence.setting,toRaw(tags))
        returnValue(exitence)
        closePopUp(popUp)
    }
</script>

<style scoped lang='scss'>
    @use "@/static/style/components/popUpButtons.scss";
    .top{
        display: flex;
        height: 100px;
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
        height: calc(100% - 200px);
        overflow: auto;
        .tags{
            display: flex;
            >.text{
                flex-shrink: 0;
            }
        }
        .setting{
            width: 100%;
            .button{
                width: 30%;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 3px solid black;
                padding: 5px;
            }
        }
    }
        
    
    .buttons{
        @extend .buttons
    }
</style>