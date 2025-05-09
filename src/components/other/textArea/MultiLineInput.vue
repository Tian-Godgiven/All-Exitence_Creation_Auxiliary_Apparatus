<template>
<div class="multiLineInput"
    :class="showPlaceholder ? 'showPlaceholder':null"
    ref="inputRef"
    :contenteditable="true"
    :placeholder="placeholder"
    inputmode="text"
    tabindex="0"
    @input="onInput"
    @blur="onBlur"
    @focus="onFocus">
</div>
</template>

<script setup lang='ts'>
    import { onMounted, ref, useTemplateRef } from 'vue';
    import { toString } from 'lodash';
import { focusOnEnd } from '@/api/focusOnEnd';

    //占位符
    const {placeholder=""} = defineProps<{placeholder?:string}>()
    //初始值
    const content = defineModel<any>()
    //暴露一个聚焦方法
    defineExpose({
        "focusInput":focusInput
    })

    onMounted(()=>{
        loadText(content.value)
    })

    const inputRef = useTemplateRef("inputRef")  
    const showPlaceholder = ref(true) //当前是否显示placeholder

    //向inputRef中加载文本
    function loadText(text:string){
        //如果加载的内容为空，则会尝试加载占位符
        if(text.trim() == ""){
            inputRef.value!.innerText = placeholder
            showPlaceholder.value = true
        }
        else{
            inputRef.value!.innerText = text
            showPlaceholder.value = false
        }
    }

    const emits = defineEmits(["input","blur","focus"])
    //同步输入内容
    function onInput(){
        const newContent = inputRef.value?.innerText
        content.value = newContent
        if(newContent?.trim() != ""){
            showPlaceholder.value = false
        }
        emits("input")
    }

    //取消聚焦
    function onBlur(){
        //内容为空时显示placeholder
        if(!content.value || toString(content.value).trim()==""){
            loadText("")
            return;
        }
        else{
            showPlaceholder.value = false
        }
        emits("blur",content.value)
    }
    //聚焦
    function onFocus(){
        //清空placeholder
        if(showPlaceholder.value){
            inputRef.value!.innerHTML = ""
            showPlaceholder.value = false
        }
        //聚焦到末尾
        focusOnEnd(inputRef.value)
        emits("focus",content.value)
    }

    //聚焦到div上
    function focusInput(){
        if(inputRef.value){
            inputRef.value.focus()
        }
    }

    
</script>

<style scoped lang='scss'>
.multiLineInput{
    position: relative;
    min-height: inherit;
    font-size: inherit;
    height: 100%;
    width: 100%;
    outline: none;
    word-break: break-all;
    z-index: 1;
    overflow: inherit;
    text-overflow: inherit;
    white-space: inherit;
    :focus{
        border: none;
    }
    &.showPlaceholder{
        font-size: 1em;
        text-decoration-color: rgb(125, 125, 125)!important;
        color:rgb(125, 125, 125)!important;
    }
}
</style>