<template>
<div class="managePage">
    <div class="top">
        <div class="title">暂记版</div>
        <div class="buttons">
            <Button icon="add" name="创建" @click="create"></Button>
            <Button icon="manage" name="管理模式" @click="switchManageMode"></Button>
            <Button :icon="floatWindowKey?'hideFloat':'showFloat'" name="切换显示悬浮窗" @click="switchFloatWindow"></Button>
            <Button icon="closePopUp" name="关闭" @click="close"></Button>
        </div>
    </div>
    <DraggableList 
        :drag-handle="true"
        :show-handle="manageMode"
        :list="quickDraft" 
        class="container" 
        v-slot="{item}">
        <QuickDraftItem 
            :key="item.__key"
            :manage-mode="manageMode"
            :quick-draft-item="item"/>
    </DraggableList>
</div>
</template>

<script setup lang="ts">
import DraggableList from '@/components/other/DraggableList.vue';
import Button from '@/components/global/Button.vue';
import { addQuickDraftItem, createQuickDraftItem, nowQuickDraft , switchQuickDraftFloatWindow, switchFoldFloatWindow, floatWindowKey } from '../quickDraft';
import { closePopUp, PopUp } from '@/hooks/pages/popUp';
import { ref } from 'vue';
import QuickDraftItem from './QuickDraftItem.vue';

    const {popUp} = defineProps<{popUp?:PopUp}>()
    const quickDraft = nowQuickDraft
    //切换管理模式
    const manageMode = ref(false)
    function switchManageMode(){
        manageMode.value = !manageMode.value
    }

    //切换显示悬浮窗
    function switchFloatWindow(){
        switchQuickDraftFloatWindow()
    }

    //创建并添加新的暂记对象到开始
    function create(){
        const newItem = createQuickDraftItem()
        addQuickDraftItem(newItem,0)
    }

    //关闭
    function close(){
        if(popUp)closePopUp(popUp)
        else{
            //收起悬浮窗
            switchFoldFloatWindow(true)
        }
    }
</script>

<style scoped lang="scss">
.managePage{
        width: 100%;
        position: relative;
        z-index: 1;
        .top{
            display: flex;
            height: 2.5rem;
            .title{
                font-size: $midFontSize;
            }
            .buttons{
                margin-left: auto;
                display: flex;
                >.button{
                    aspect-ratio: 1;
                    height: 2rem;
                }
            }
        }
        .container{
            box-sizing: border-box;
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 20px;
            margin: 10px 0;
            :deep(.dragNode){
                border-radius: 10px;
                position: relative;
                box-shadow: $listItemShadow;
            }
        }
    }
</style>