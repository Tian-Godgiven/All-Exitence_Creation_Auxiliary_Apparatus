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
        </div>
        <slot name="scrollSpace"></slot>
    </div>
</template>

<script setup lang='ts'>
import { focusOnEnd } from '@/api/focusOnEnd';
import { showInputSupport } from '@/hooks/inputSupport/inputSupport';
import { inject, onMounted, ref, useTemplateRef, watch } from 'vue';
import { checkInputSuggestion, hideInputSuggestion, showInputSuggestion } from '@/hooks/inputSupport/inputSuggestion/inputSuggestion';
import { addInputLast, addInputLastDiv, deleteInputLast } from '@/api/cursorAbility';
import { findTargetDivs } from '@/hooks/findTargetDiv';
import { translateToFileContent, translateToFrontEndContent } from '@/hooks/expression/textAreaContent';

    const textArea = useTemplateRef('textArea');
    let showPlaceholder = ref(true) //当前是否显示placeholder
    let effectInput = "" //有效输入
    let selectionRange:any //记录光标上一次聚焦的位置

    //占位符，是否启用输入辅助，输入建议列表
    const {placeholder,inputSupport,inputSuggestionList,mode} = defineProps(
        ["placeholder","inputSupport","inputSuggestionList","mode"])
    //是否禁用修改
    const disabled = inject("disabled",false)
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
        
    //显示占位符
    function loadPlaceholder(){
        const dom = document.createElement('text')
        dom.innerHTML = placeholder??""
        loadDom([dom])
        showPlaceholder.value = true
    }    

    //初始化内容
    onMounted(()=>{
        //如果是禁用状态，则监听content变化
        if(disabled){
            watch(content,()=>{
                const doms = translateToFrontEndContent(content.value)
                loadDom(doms)
            },{
                immediate:true,
            })
        }
        else{
            // 未传入内容时显示placeholder
            if(content.value == "" || content.value?.length==0 || !content.value){
                loadPlaceholder()
            }
            // 否则显示content的值
            else{ 
                showPlaceholder.value = false
                const doms = translateToFrontEndContent(content.value)
                loadDom(doms)
            }
        }
    })
    //向textArea中加载dom
    function loadDom(doms:Node[]){
        //清空
        textArea.value!.innerText = ""
        doms.forEach((dom:Node) => {
            textArea.value!.appendChild(dom)
        });
    }

    //同步前端内容到content中
    function syncContent(){
        //如果是字符串模式则同步字符串内容
        if(mode=="string"){
            content.value = textArea.value!.innerText
        }
        //否则向其中同步文件内容
        else{
            const nodes = textArea.value!.childNodes
            //content内应当存储文件内容
            const fileContent = translateToFileContent(nodes)
            content.value = fileContent
        }
    }

    
    //同步输入，判断输入补全提示
    function onInput(event:any){
        //同步输入位置
        const selection = window.getSelection();
        if(selection) selectionRange = selection.getRangeAt(0);

        const newInput = event.data
        listenInput(newInput)
    }
    //输入监听
    function listenInput(newInput:any){
        //同步content的内容
        const newContent = syncContent()
        //如果需要输入建议，则check新输入的内容
        if(inputSuggestionList){
            // 将新的输入内容添加到有效输入
            if(newInput){
                effectInput += newInput
            }
            else{return false}
            //检查是否存在输入建议
            const content = checkInputSuggestion(inputSuggestionList,effectInput)
            // 有输入建议：显示输入补全框，如果完成了输入提示则进行一次同步
            if(content){
                showInputSuggestion({
                    input:effectInput,
                    "suggestionContent":content,
                    "onInputSuggestion":()=>{
                        syncContent()
                    }
                })
                return;
            }
            // 整体不行，则再单独判断新输入的内容
            const content2 = checkInputSuggestion(inputSuggestionList,newInput)
            //可行则更新有效输入
            if(content2){
                effectInput = newInput
                showInputSuggestion({
                    input:effectInput,
                    "suggestionContent":content2,
                    "onInputSuggestion":()=>{
                        syncContent()
                    }
                })
            }
            //都还是不行，则清空有效输入
            else{
                //否则清空有效输入,关闭输入补全框
                hideInputSuggestion()
                effectInput = ""
            }
        }
        
        //执行input事件，返回新输入的内容
        emits("input",newContent,newInput)
        
    }

    //移动光标到其他位置时清空有效输入,同时记录当前光标位置
    let oldPosition:any
    function clickEvent(){
        const selection = window.getSelection();
        if(!selection){return false}
        // 获取当前光标的范围并记录
        const range = selection.getRangeAt(0);  
        selectionRange = range
        // 获取光标位置的文本节点和偏移量
        const newPosition = range.startOffset;
        //位置发生改变则清空有效输入
        if(oldPosition != newPosition){
            effectInput = ""
        }
        oldPosition = newPosition
        
    }
    //取消聚焦
    function onBlur(){
        
        //先同步内容，再设置placeholder
        syncContent()
        // 为空时显示placeholder
        if(content.value == "" || !content.value){
            loadPlaceholder()
            return false
        }
        else{
            showPlaceholder.value = false
        }
        
        emits("blur",content.value)
    }
    //聚焦
    function onFocus(){
        //取消placeholder
        if(showPlaceholder.value){
            //清空placeholder
            textArea.value!.innerHTML = ""
            showPlaceholder.value = false
            //重新聚焦一下
            focusOnEnd(textArea.value)
        }
        //是否显示输入辅助栏
        if(inputSupport){
            showInputSupport()
        }
        // 重置有效输入
        effectInput = ""
        syncContent()
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
        if(showPlaceholder.value){
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
        z-index: 1;
        :focus{
            border: none;
        }
    }
    .textArea.showPlaceholder{
        font-size: 1em;
        text-decoration-color: rgb(125, 125, 125)!important;
        color:rgb(125, 125, 125)!important;
    }

</style>