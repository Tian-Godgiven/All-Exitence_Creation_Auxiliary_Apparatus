<template>
<div class="chooseExitenceValue" :class="{editMode:ifEditMode}">
    <div class="value">
        <!-- 在同一行 -->
        <div class="line" v-if="inOneLine">
            <div class="exitenceContainer">
                <template v-for="type in list">
                    <Button class="exitence" 
                        v-for="exitence in type.exitences"
                        @click="clickExitence(type.typeKey,exitence.key)">
                        {{ exitence.name }}
                    </Button>
                </template>
                <Button @click="switchEditPart" class="edit" 
                    :icon="ifEditMode?'close':'edit'"></Button>
            </div>
        </div>
        <!-- 多行 -->
        <div class="line" v-else v-for="type,index in list">
            <div class="top" >
                <div class="title" v-if="!noTitle">{{ type.title }}</div>
                <Button v-if="index===0&&!noTitle" @click="switchEditPart" class="edit" 
                    :icon="ifEditMode?'close':'edit'"></Button>
            </div>
            <div class="exitenceContainer">
                <Button class="exitence" 
                    v-for="exitence in type.exitences"
                    @click="clickExitence(type.typeKey,exitence.key)">
                    {{ exitence.name }}
                </Button>
                <Button v-if="index===list.length-1&&noTitle" @click="switchEditPart" class="edit" 
                    :icon="ifEditMode?'close':'edit'"></Button>
            </div>
        </div>
        <!-- 无内容 -->
        <div class="noValue" @click="switchEditPart" v-if="list.length==0">选择事物</div>
    </div>
    <EditPart :disabled :status :setting="statusSetting" v-if="ifEditMode"></EditPart>
</div>
</template>

<script setup lang='ts'>
    import { computed, ref } from 'vue';
    import EditPart from './EditPart.vue';
    import { getChooseExitenceStatusList, removeExitenceFromChooseExitenceStatus, type ChooseExitenceStatus } from '@/hooks/all-exitence/status/chooseExitence';
import { getExitenceByKey, getTypeByKey, showExitenceOnPopUp } from '@/hooks/all-exitence/allExitence';
import Button from '@/components/global/Button.vue';
import { getSettingValue } from '@/hooks/all-exitence/status';
    const {status,statusSetting} = defineProps<{
        status:ChooseExitenceStatus,
        statusSetting:Record<string,any>
    }>()
    //已选择的列表
    const list = computed(()=>{
        return getChooseExitenceStatusList(status)
    })

    //属性设置：总可选数量
    const disabled = computed(()=>{
        const chooseExitenceNum = getSettingValue(statusSetting,"chooseExitenceNum","number")
        if(chooseExitenceNum !== null){
            //当前总数超过总可选数量
            let allNumber = 0
            for(let type of list.value){
                allNumber += type.exitences.length
            }
            //禁用选择
            if(allNumber >= chooseExitenceNum){
                return true
            }
        }
        return false
    })

    //编辑模式
    const ifEditMode = ref<boolean>(false)
    function switchEditPart(){
        ifEditMode.value = !ifEditMode.value
    }

    //点击事物
    function clickExitence(typeKey:string,exitenceKey:string){
        //编辑模式下移除事物
        if(ifEditMode.value){
            removeExitenceFromChooseExitenceStatus(status,typeKey,exitenceKey)
        }
        //否则显示事物弹窗
        else{
            const type = getTypeByKey(typeKey)
            if(!type)return;
            const exitence = getExitenceByKey(type,exitenceKey)
            if(!exitence)return
            showExitenceOnPopUp(type,exitence)
        }
        
        
    }

    //属性设置：不显示行标题
    const noTitle = computed(()=>{
        const noTitle = getSettingValue(statusSetting,"noLineTitle","bool")
        if(noTitle === true){
            return true
        }
        //属性设置：所有事物在同一行中，此时不显示行标题
        if(inOneLine.value)return true
        return false
    })
    //属性设置：所有事物在同一行中
    const inOneLine = computed(()=>{
        //属性设置：所有事物在同一行中，此时不显示行标题
        const value = getSettingValue(statusSetting,"allExitenceInOneLine","bool")
        if(value === true){
            return true
        }
        return false
    })
</script>

<style scoped lang='scss'>
.chooseExitenceValue{
    overflow: hidden;
}
.editMode{
    box-sizing: border-box;
    box-shadow: $groundShadow;
    margin: 6px;
    border-radius: 20px;
    padding: 10px;
}

.line{
    .top{
        display: flex;
        min-height: 15px;
        .title{
            flex-grow: 1;
        }
    }
}
.edit{
    flex-shrink: 0;
    width: 50px;
    height: 50px;
}

.exitenceContainer{
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 5px 10px;
    flex: 0 1;
    .exitence{
        height: 50px;
        padding: 5px 20px;
        border-radius: 30px;
        background-color: $bgColor90;
    }
}

    
</style>