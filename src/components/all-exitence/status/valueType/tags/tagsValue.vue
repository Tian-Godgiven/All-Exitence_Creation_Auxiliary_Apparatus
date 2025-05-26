<template>
<div class="tagsValue" :class="editMode?'editMode':''">
    <div class="tagContainer">
        <TagDiv :tag :deleteTag 
            :updateTag="(newTag)=>{updateTag(newTag,tag)}" 
            v-for="tag in tags">
        </TagDiv>
        <Button v-if="ifAddTag" @click="switchEditMode" icon="edit"></Button>
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

    const {status,statusSetting} = defineProps<{
        status:Status,
        statusSetting:any
    }>()
    let tags:string[] = status.value
    //是否允许添加新标签
    const ifAddTag = computed(()=>{
        if(!statusSetting || statusSetting.tagsAdd == null){
            return true
        }
        return statusSetting.tagsAdd
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
            //防呆
            if(!isArray(status.value)){
                status.value = []
                tags = status.value
            }
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
    .tagContainer{
        display: flex;
        flex-wrap: wrap;
        .tag{
            min-width: 50px;
            border:3px solid black;
            padding: 5px 10px;
            margin: 5px 5px;
        }
        .button{
            flex-shrink: 0;
            width: 50px;
            height: 50px;
        }
    }
    
}
</style>