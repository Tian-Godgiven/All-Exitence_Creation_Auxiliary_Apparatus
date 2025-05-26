<template>
<div ref="tagRef" 
    class="tag" 
    @pointerdown.stop
    @click.stop="clickTag">
    <div class="text" v-if="!editMode">{{ tag }}</div>
    <div class="inputContainer" v-else>
        <MultiLineInput 
            @pointerdown.stop
            class="input"
            v-bind:model-value="tag" 
            v-on:update:model-value="updateTag"
            ref="inputRef" 
            placeholder="空标签"/>
        <Button class="delete"
            v-if="editMode" 
            icon="delete" 
            @click="deleteTag(tag)"></Button>
    </div>
</div>
</template>

<script setup lang='ts'>
    import { ref, useTemplateRef } from 'vue';
    import Button from '@/components/global/Button.vue';
    import MultiLineInput from '@/components/other/textArea/MultiLineInput.vue';
    import { nextTick } from 'vue';
    let {tag,deleteTag,updateTag} = defineProps<{
        tag:string,
        deleteTag:(tag:string)=>void,
        updateTag:(newTag:string)=>void
    }>()
    const editMode = ref(false)
    //点击tag切换到编辑模式
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