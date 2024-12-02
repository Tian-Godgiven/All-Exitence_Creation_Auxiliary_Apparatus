<template>
    <div class="container" 
        @click="focusOnTextArea" 
        :class="showPlaceholder ? 'showPlaceholder':null">
        <div class="textArea"
            ref="textArea"
            contenteditable="true"
            :placeholder="placeholder"
            inputmode="text"
            tabindex="0"
            @click="(event)=>{event.stopPropagation()}"
            @input="onInput"
            @blur="onBlur"
            @focus="onFocus">
            {{ showText }}
        </div>
    </div>
</template>

<script setup lang='ts'>
import { focusOnEnd } from '@/api/focusOnEnd';
import { ref } from 'vue';

    const {placeholder} = defineProps(["placeholder"])
    const content = defineModel<string>()
    const emits = defineEmits(["input","blur","focus"])
    const showText = ref("")
    const textArea = ref()
    let ifFocusing = false //当前是否聚焦
    let showPlaceholder = false //当前是否显示placeholder
    // 未传入内容显示placeholder
    if(content.value == "" || !content.value){
        showText.value = placeholder
        showPlaceholder = true
    }
    else{
        showText.value = content.value
        showPlaceholder = false
    }
    // 当前未聚焦时，点击空区域聚焦到末尾
    function focusOnTextArea(){
        if(!ifFocusing){
            focusOnEnd(textArea.value)
            ifFocusing = true
        }
    }
    //同步输入
    function onInput(event:any){
        content.value = event.target.textContent
        emits("input",content.value)
    }
    //取消聚焦
    function onBlur(){
        // 为空时显示placeholder
        if(content.value == "" || !content.value){
            showText.value = placeholder
            showPlaceholder = true
        }
        else{
            showPlaceholder = false
        }
        ifFocusing = false
        emits("blur",content.value)
    }
    //聚焦
    function onFocus(){
        //取消placeholder
        if(showPlaceholder){
            showPlaceholder = false
            showText.value = ""
            //重新聚焦一下
            focusOnEnd(textArea.value)
        }
        emits("focus",content.value)
    }

    
</script>

<style scoped lang='scss'>
    .container{
        width: 100%;
        min-height: inherit;
        height: 100%;
        font-size: inherit;
    }
    .container.showPlaceholder{
        font-size: 1em;
        text-decoration-color: rgb(125, 125, 125)!important;
        color:rgb(125, 125, 125)!important;
    }
    .textArea{
        width: 100%;
        outline: none;
        :focus{
            border: none;
        }
    }
</style>