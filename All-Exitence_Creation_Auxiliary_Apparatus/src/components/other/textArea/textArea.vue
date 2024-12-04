<template>
    <div class="container">
        <div class="textArea"
            :class="showPlaceholder ? 'showPlaceholder':null"
            :inputSupport = "inputSupport"
            ref="textArea"
            contenteditable="true"
            :placeholder="placeholder"
            inputmode="text"
            tabindex="0"
            @click="clickEvent"
            @input="onInput"
            @blur="onBlur"
            @focus="onFocus">
            {{ showText }}
        </div>
        <inputSuggestionVue v-if="checkList"/>
    </div>
</template>

<script setup lang='ts'>
import { focusOnEnd } from '@/api/focusOnEnd';
import { showInputSupport } from '@/hooks/inputSupport';
import { ref } from 'vue';
import inputSuggestionVue from '../inputSuggestion.vue';
import { checkInputSuggestion, hideInputSuggestion, showInputSuggestion } from '@/hooks/inputSuggestion';
import { getInputLast } from '@/api/getInputPosition';

    const {placeholder,inputSupport,checkList} = defineProps(["placeholder","inputSupport","checkList"])
    const content = defineModel<string>()
    const emits = defineEmits(["input","blur","focus"])
    const showText = ref("")
    const textArea = ref()
    let showPlaceholder = false //当前是否显示placeholder
    let effectInput = "" //有效输入
    // 未传入内容显示placeholder
    if(content.value == "" || !content.value){
        showText.value = placeholder
        showPlaceholder = true
    }
    else{
        showText.value = content.value
        showPlaceholder = false
    }
    //同步输入，判断输入补全提示
    function onInput(event:any){
        //获取新输入的内容
        const text = event.target.textContent
        content.value = text
        emits("input",content.value)
        //如果需要输入建议，则check内容
        if(checkList){
            // 将新的输入内容添加到有效输入
            const newInput = getInputLast()
            if(newInput){
                effectInput += newInput
            }
            else{
                return false
            }
            
            const content = checkInputSuggestion(checkList,effectInput)
            // 有输入建议：显示输入补全框
            if(content){
                showInputSuggestion(effectInput,content)
            }
            // 整体不行，则再单独判断新输入
            else{
                const content2 = checkInputSuggestion(checkList,newInput)
                //可行则更新有效输入
                if(content2){
                    effectInput = newInput
                    showInputSuggestion(effectInput,content2)
                }
                //都还是不行，则清空有效输入
                else{
                    //否则清空有效输入,关闭输入补全框
                    hideInputSuggestion()
                    effectInput = ""
                }
                
            }
        }
    }
    //移动光标到其他位置时清空有效输入
    let oldPosition:any
    function clickEvent(){
        const selection = window.getSelection();
        if(selection){
            const range = selection.getRangeAt(0);  // 获取当前光标的范围
            // 获取光标位置的文本节点和偏移量
            const newPosition = range.startOffset;
            //位置发生改变则清空有效输入
            if(oldPosition != newPosition){
                effectInput = ""
            }
        }
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
        //是否显示输入辅助栏
        if(inputSupport){
            showInputSupport()
        }
        // 重置有效输入
        effectInput = ""
        emits("focus",content.value)
    }
    
</script>

<style scoped lang='scss'>
    .textArea{
        position: relative;
        min-height: inherit;
        font-size: inherit;
        height: 100%;
        width: 100%;
        outline: none;
        :focus{
            border: none;
        }
        z-index: 1;
    }
    .textArea.showPlaceholder{
        font-size: 1em;
        text-decoration-color: rgb(125, 125, 125)!important;
        color:rgb(125, 125, 125)!important;
    }
</style>