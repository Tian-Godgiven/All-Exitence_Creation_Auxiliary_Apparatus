<template>
<div class="tagsValue" :class="editMode?'editMode':''">
    <div class="top">
        <div class="tagContainer">
            <TagDiv :tag :deleteTag 
                :key="Symbol()"
                :updateTag="(newTag)=>{updateTag(newTag,tag)}" 
                v-for="tag in tags">
            </TagDiv>
            <Button class="edit" v-show="!editMode" v-if="ifAddTag" @click="switchEditMode" icon="edit"></Button>
        </div>
        <Button class="close" v-show="editMode" v-if="ifAddTag" @click="switchEditMode" icon="close"></Button>
    </div>
    <ChooseTag class="editing" v-if="editMode && ifAddTag" :addTag :chosenTags="tags" ></ChooseTag>
</div>
</template>

<script setup lang='ts'>
import { showAlert } from '@/hooks/alert';
import Status from '@/interfaces/Status';
import TagDiv from '@/supportAbility/tagLibrary/components/TagDiv.vue';
import { isArray } from 'lodash';
import { computed, ref } from 'vue';
import ChooseTag from './ChooseTag.vue';
import Button from '@/components/global/Button.vue';
import { ExitenceStatus } from '@/class/Exitence';
import { getStatusSettingValue } from '@/hooks/all-exitence/status';

    const {status,fullStatus} = defineProps<{
        status:Status|ExitenceStatus,
        fullStatus:Status
    }>()
    const tags = computed<string[]>(()=>{
        //防呆
        console.log(status)
        if(!isArray(status.value)){
            status.value = []
        }
        console.log(fullStatus.value)
        return fullStatus.value
    })
    //是否允许添加新标签
    const ifAddTag = computed(()=>{
        const addTag = getStatusSettingValue(fullStatus.setting,"tagsAdd","bool")
            ??true
        return addTag
    })

    //切换编辑标签模式
    const editMode = ref(false)
    function switchEditMode(){
        editMode.value = !editMode.value
    }
    function addTag(newTag:string){
        if(newTag == ""){
            return false
        }
        else{
            status.value.push(newTag)
        }
    }
    //删除
    function deleteTag(tag:string){
        showAlert({
            "info":`删除标签${tag}？`,
            "confirm":()=>{
                const index = status.value.findIndex((item:string)=>item==tag)
                status.value.splice(index,1)
            }
        })
    }
    //更新
    function updateTag(newTag:string,oldTag:string){
        const index = status.value.findIndex((item:string)=>item==oldTag)
        status.value[index] = newTag
    }
</script>

<style scoped lang='scss'>
.tagsValue{
    &.editMode{
        width: 70vw;
        box-sizing: border-box;
        box-shadow: $groundShadow;
        margin: 6px;
        border-radius: 20px;
        padding: 10px;
    }
    .top{
        display: flex;
        .tagContainer{
            display: flex;
            flex-grow: 1;
            flex-wrap: wrap;
            .tag{
                min-width: 50px;
                border:3px solid black;
                padding: 5px 10px;
                margin: 5px 5px;
            }
        }
    }
    
    .edit,.close{
        flex-shrink: 0;
        width: 50px;
        height: 50px;
    }
}
</style>