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
    </div>
</template>

<script setup lang='ts'>
import { focusOnEnd } from '@/api/focusOnEnd';
import { showInputSupport } from '@/hooks/inputSupport';
import { ref } from 'vue';
import { checkInputSuggestion, hideInputSuggestion, showInputSuggestion } from '@/hooks/inputSuggestion';
import { addInputLast, addInputLastDiv, deleteInputLast, getInputLast } from '@/api/cursorAbility';
import { findTargetDivs } from '@/hooks/findTargetDiv';

    const textArea = ref()
    let showPlaceholder = false //当前是否显示placeholder
    let effectInput = "" //有效输入
    let selectionRange:any //记录光标上一次聚焦的位置

    //是否启用修改，占位符，是否静态，是否启用输入辅助，输入建议列表
    const {disabled,placeholder,inputSupport,inputSuggestionList} = defineProps(
        ["disabled","placeholder","inputSupport","inputSuggestionList"])
    //初始值
    const content = defineModel<any>()
    const emits = defineEmits(["input","blur","focus"])

    //允许通过父组件访问textArea的一些方法
    defineExpose({
        "focusOnEnd":()=>focusOnEnd(textArea),
        "addDom":addDom,
        "addContent":addContent,
        "getContentDom":getContentDom,
        "deleteContent":deleteContent
    })
    
    //初始化值
    let showText:any
    //如果是禁用状态，则showText动态
    if(disabled){
        showText = content
    }
    else{
        showText = ref("")
        // 未传入内容显示placeholder
        if(content.value == "" || !content.value){
            showPlaceholder = true
            showText.value = placeholder
        }
        // 传入content则显示content的值
        else{ 
            showPlaceholder = false
            showText.value = content.value
        }
    }
    
    //同步输入，判断输入补全提示
    function onInput(event:any){
        const selection = window.getSelection();
        if(selection) selectionRange = selection.getRangeAt(0);
        //获取输入的内容
        const text = event.target.textContent
        const newInput = getInputLast()
        content.value = text
        emits("input",text,newInput)
        //如果需要输入建议，则check内容
        if(inputSuggestionList){
            // 将新的输入内容添加到有效输入
            if(newInput){
                effectInput += newInput
            }
            else{
                return false
            }
            
            const content = checkInputSuggestion(inputSuggestionList,effectInput)
            // 有输入建议：显示输入补全框
            if(content){
                showInputSuggestion(effectInput,content)
            }
            // 整体不行，则再单独判断新输入
            else{
                const content2 = checkInputSuggestion(inputSuggestionList,newInput)
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
    //移动光标到其他位置时清空有效输入,同时记录当前光标位置
    let oldPosition:any
    function clickEvent(){
        const selection = window.getSelection();
        if(selection){
            const range = selection.getRangeAt(0);  // 获取当前光标的范围并记录
            selectionRange = range
            // 获取光标位置的文本节点和偏移量
            const newPosition = range.startOffset;
            //位置发生改变则清空有效输入
            if(oldPosition != newPosition){
                effectInput = ""
            }
            oldPosition = newPosition
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
    //向该输入区中添加一个dom元素
    function addDom(domHTML:string){
        //如果还没有聚焦过，则默认为末尾的位置
        if(!selectionRange){
            focusOnEnd(textArea.value)
        }
        //添加相应class的div并更新selectionRange
		selectionRange = addInputLastDiv(domHTML,selectionRange)
    }
    //向该输入区中添加一段文本
    function addContent(text:string){
        //如果还没有聚焦过，则默认为末尾的位置
        if(!selectionRange){
            focusOnEnd(textArea.value)
        }
        selectionRange = addInputLast(text,selectionRange)
    }
    //删除输入区的前n个内容
    function deleteContent(length:number){
        //如果还没有聚焦过，则默认为末尾的位置
        if(!selectionRange){
            focusOnEnd(textArea.value)
        }
        deleteInputLast(length,selectionRange)
    }
    //获取输入区中的内容，包括其中存在特殊div的情况
    function getContentDom(domClass:string,getRule:()=>{}){
        //如果此时内容为空
        if(showPlaceholder){
            return null;
        }
        const contentDom = findTargetDivs(textArea.value,[],domClass,getRule)
        return contentDom
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
        word-break: break-all;
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