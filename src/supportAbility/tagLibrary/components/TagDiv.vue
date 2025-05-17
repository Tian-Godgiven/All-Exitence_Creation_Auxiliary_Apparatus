<template>
<div ref="tagRef" 
    class="tag" 
    @pointerdown.stop @click.stop  
    @click="clickTag">
    <div class="text" v-if="!editMode">{{ tag.label }}</div>
    <div class="inputContainer" v-else>
        <MultiLineInput 
            @pointerdown.stop
            class="input"
            v-model="tag.label"
            ref="inputRef" 
            placeholder="空标签"/>
        <Button class="delete"
            v-if="editMode" 
            icon="delete" 
            @click="deleteTag"></Button>
    </div>
</div>
</template>

<script setup lang='ts'>
    import { ref, useTemplateRef } from 'vue';
    import { deleteTagFromGroup, TagGroup, TagItem } from '../tagLibrary';
    import Button from '@/components/global/Button.vue';
    import MultiLineInput from '@/components/other/textArea/MultiLineInput.vue';
    import { nextTick } from 'vue';
    const {tag,tagGroup} = defineProps<{tag:TagItem,tagGroup:TagGroup}>()
    const editMode = ref(false)
    //点击tag允许编辑文本+显示删除按钮，点击到外界结束
    const tagRef = useTemplateRef("tagRef")
    const listener = (event:MouseEvent)=>{
        if(tagRef.value && !tagRef.value.contains(event.target as Node)){
            editMode.value = false;
            document.removeEventListener("click",listener)
        }
    }
    const inputRef = useTemplateRef("inputRef")
    function clickTag(){
        //允许编辑文本+显示删除按钮
        editMode.value = true
        //聚焦到输入框
        nextTick(()=>{
            if(inputRef.value){
                inputRef.value.focusInput()
            }
        })
        document.addEventListener("click",listener)
    }
    function deleteTag(){
        deleteTagFromGroup(tagGroup,tag)
    }
</script>

<style scoped lang='scss'>
.tag{
    height: fit-content;
    position: relative;
    padding: 5px 15px;
    border-radius: 10px;
    background-color: $bgColor90;
    .text{
        word-break: break-all;
        @include textMaxLine(1)
    }
    .inputContainer{
        display: flex;
        align-items: center;
        .input{
            margin-right: 9px;
        }
        .input::after{
            content: "";
            display: inline-block;
            position: absolute;
            right: -5px;
            top: 0;
            width: 3px;
            height: 90%;
            margin: 5% 0;
            background-color:$antiBgColor;
            opacity: 0.3;
        }
        .delete{
            box-sizing: border-box;
            border-radius: 50%;
            height: 51px;
            width: 51px;
        }
    }
    
}
</style>