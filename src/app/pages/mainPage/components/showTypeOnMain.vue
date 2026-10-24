<template>
<TargetContainer title-align="left" :if-info="false">
    <template #title>
        <textAreaVue
            @input="changeName"
            mode="string"
            placeholder="输入分类名称"
            :inputSupport="true"
            v-model="type.name"
            class="typeName"
        />
    </template>
    <template #topBar>
        <Menu class="typeAbility" vertical="right" horizen="bottom">
            <template #default="{switchMenu}">
                <Button @click="switchMenu" icon="setting"/>
            </template>
            <template #menu="{controlShow}">
                <ListMenu :controlShow :list="abilityList"/>
            </template>
        </Menu>
    </template>
    <template #inner>
        <section class="typeProperties">
            <div class="sectionTitle">分类属性</div>
            <DraggableList
                :drag-handle="true"
                :list="type.typeStatus"
                v-slot="{item:status}">
                <TypeStatus
                    :key="status.__key"
                    :type
                    :status
                    @deleteStatus="deleteStatus(status)"/>
            </DraggableList>
            <div class="newStatusBlock">
                <button
                    v-if="!isCreatingStatus"
                    class="newStatusTrigger"
                    type="button"
                    @click="isCreatingStatus = true">
                    新增属性
                </button>
                <NewTypeStatus
                    v-else
                    :type
                    :createStatus="addStatus"
                    :banValueType="['relation','multi','status']"/>
            </div>
        </section>
        <div class="scrollSpace"></div>
    </template>
</TargetContainer>
</template>

<script setup lang="ts" name="showTypeOnMain">
import { ref } from 'vue'
import { nanoid } from 'nanoid'
import textAreaVue from '@/components/other/textArea/textArea.vue'
import Button from '@/components/global/button.vue'
import DraggableList from '@/components/other/DraggableList.vue'
import TypeStatus from '@/popUps/all-exitence/editType/TypeStatus.vue'
import NewTypeStatus from '@/popUps/all-exitence/editType/NewTypeStatus.vue'
import TargetContainer from './TargetContainer.vue'
import { Type } from '@/class/Type'
import Status from '@/interfaces/Status'
import Menu from '@/components/global/Menu.vue'
import ListMenu from '@/components/global/ListMenu.vue'
import { showSetTypePopUp } from '@/hooks/all-exitence/allExitence'

const { type } = defineProps<{type:Type}>()
const isCreatingStatus = ref(false)
const abilityList = [{
    label:'分类设置',
    click:()=>showSetTypePopUp(type)
}]

function changeName(newName:string){
    type.name = newName
}

function addStatus(status:Status){
    status.__key = nanoid()
    type.typeStatus.push(status)
    isCreatingStatus.value = false
}

function deleteStatus(status:Status){
    const index = type.typeStatus.indexOf(status)
    if(index >= 0) type.typeStatus.splice(index,1)
}
</script>

<style lang="scss" scoped>
.typeName{
    width: min(100%, 520px);
    height: 40px;
    font-size: 1.4rem;
}
.typeAbility{
    width: 40px;
    height: 40px;
    .button{
        width: 40px;
        height: 40px;
        padding: 6px;
        box-sizing: border-box;
        border-radius: 10px;
    }
}
.typeProperties{
    width: min(100%, 920px);
    padding-top: 18px;
}
.sectionTitle{
    min-height: 42px;
    display: flex;
    align-items: center;
    font-weight: 600;
}
.newStatusBlock{
    width: 100%;
    margin-top: 18px;
    border: 1px dashed $bgColor70;
    border-radius: 8px;
    box-sizing: border-box;
    overflow: hidden;
    :deep(.newStatus){
        margin-top: 0;
        padding: 12px;
        border-top: 0;
        .editStatus{
            border: 0;
            border-radius: 0;
            padding: 0;
        }
    }
}
.newStatusTrigger{
    width: 100%;
    min-height: 52px;
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    cursor: pointer;
    &:hover{
        background-color: $bgColor90;
    }
}
.scrollSpace{ height: 30%; }

@media (min-width: 900px){
    .typeName{ height: 40px; }
}
</style>
