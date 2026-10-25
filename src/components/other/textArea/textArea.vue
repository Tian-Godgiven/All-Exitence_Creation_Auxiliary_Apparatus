<template>
<div class="textArea"
    :class="showPlaceholder ? 'showPlaceholder':null"
    :inputSupport = "inputSupport"
    ref="textArea"
    :contenteditable="mode != 'disabled'?true:false"
    :placeholder="placeholder"
    inputmode="text"
    tabindex="0"
    @scrollend="scrollEnd"
    @click="clickEvent"
    @contextmenu="textStyleContextMenu"
    @input="onInput"
    @blur="onBlur"
    @focus="onFocus">
</div>
</template>

<script setup lang='ts'>
    import { focusOnEnd } from '@/api/focusOnEnd';
    import { showInputSupport } from '@/hooks/inputSupport/inputSupport';
    import { onMounted, ref, useTemplateRef, watch } from 'vue';
    import { checkInputSuggestion, hideInputSuggestion, InputSuggestionList, showInputSuggester } from '@/supportAbility/inputSuggestion/suggester/inputSuggestion';
    import { addInputLast, addInputLastDiv, deleteInputLast } from '@/api/cursorAbility';
    import { findTargetDivs } from '@/hooks/findTargetDiv';
    import { createTextStyleDom, getTextStyleData, isTextStyleDom, setTextStyleDomData, translateToFileContent, translateToFrontEndContent, type TextStyleData, type TextStyleSnapshot } from '@/hooks/expression/textAreaContent';
    import { toString } from 'lodash';
    import { showPopUp } from '@/hooks/pages/popUp';
    import { shallowRef } from 'vue';
    import TextStyleMenu from '@/supportAbility/textStyle/TextStyleMenu.vue';
    import TextStyleInstanceEditor from '@/supportAbility/textStyle/TextStyleInstanceEditor.vue';
    import { makeTextStyleData, normalizeTextStyleSnapshot } from '@/supportAbility/textStyle/textStyle';
    import type { TextStyleMaterial } from '@/supportAbility/textStyle/textStyle';

    const textArea = useTemplateRef('textArea');
    let showPlaceholder = ref(true) //当前是否显示placeholder
    let effectInput = "" //有效输入
    let selectionRange:Range //记录光标上一次聚焦的位置

    //占位符，是否启用输入辅助，输入建议列表，输入模式
    let {placeholder,inputSupport=false,inputSuggestionList,mode,textStyleEnabled=false} = defineProps<{
        placeholder?:string,
        inputSupport?:boolean,
        inputSuggestionList?:InputSuggestionList|"project"|"global"|"all"|null,
        mode?:"string"|"all"|"disabled",
        scrollEnd?:(e:Event)=>void,
        textStyleEnabled?:boolean,
    }>()
    //初始值
    const content = defineModel<any>()
    const emits = defineEmits(["input","blur","focus","scrollEnd"])

    //允许通过父组件访问textArea的一些方法
    defineExpose({
        "focusOnEnd":()=>focusOnEnd(textArea.value),
        addDom,
        addContent,
        getContentDom,
        deleteContent,
    })

    function textStyleContextMenu(event: MouseEvent){
        if(!textStyleEnabled || !textArea.value)return
        const range = getCurrentRange()
        const styles = getTextStyleTargets(event.target)
        if((!range || range.collapsed) && styles.length === 0)return
        event.preventDefault()
        showPopUp({
            vue: shallowRef(TextStyleMenu),
            className: "controlPanelPopUp",
            mask: false,
            buttons: null,
            size: { width: "auto", height: "auto" },
            position: { x: `${event.clientX}px`, y: `${event.clientY}px` },
            props: {
                styles,
                apply: (material: TextStyleMaterial) => configureNewTextStyle(range,styles[0]?.element,material),
                edit: (style: { element: HTMLElement, data: TextStyleData }) => editTextStyle(style),
                remove: (style: { element: HTMLElement, data: TextStyleData }) => removeTextStyle(style.element),
            },
        })
    }

    function getCurrentRange(): Range | null{
        const selection = window.getSelection()
        if(!selection?.rangeCount)return null
        const range = selection.getRangeAt(0)
        if(!textArea.value?.contains(range.commonAncestorContainer))return null
        return range.cloneRange()
    }

    function getTextStyleTargets(target: EventTarget | null){
        const styles: { element: HTMLElement, data: TextStyleData }[] = []
        let current = target instanceof Node ? target : null
        while(current && current !== textArea.value){
            if(isTextStyleDom(current)){
                const data = getTextStyleData(current)
                if(data)styles.push({ element: current, data })
            }
            current = current.parentNode
        }
        return styles
    }

    function applyTextStyle(range: Range | null,target: HTMLElement | undefined,material: TextStyleMaterial){
        if(!textArea.value)return
        if(target && (!range || range.collapsed || !target.contains(range.commonAncestorContainer))){
            range = document.createRange()
            range.selectNodeContents(target)
        }
        if(!range)return
        if(range.collapsed)return
        const content = range.extractContents()
        const data = makeTextStyleData(material,[])
        const dom = createTextStyleDom(data)
        dom.appendChild(content)
        range.insertNode(dom)
        syncContent()
    }

    function configureNewTextStyle(range: Range | null,target: HTMLElement | undefined,material: TextStyleMaterial){
        showPopUp({ name: `添加${material.name}`, vue: shallowRef(TextStyleInstanceEditor), mask: true, buttons: [], size: { height: "auto" }, props: {
            snapshot: material.snapshot,
            saveSnapshot: (snapshot: TextStyleSnapshot) => applyTextStyle(range,target,{ ...material, snapshot }),
        }})
    }

    function editTextStyle(style: { element: HTMLElement, data: TextStyleData }){
        showPopUp({ name: `修改${style.data.snapshot.name}`, vue: shallowRef(TextStyleInstanceEditor), mask: true, buttons: [], size: { height: "auto" }, props: {
            snapshot: style.data.snapshot,
            saveSnapshot: (snapshot: TextStyleSnapshot) => {
                setTextStyleDomData(style.element,{ ...style.data, materialKey: undefined, snapshot: normalizeTextStyleSnapshot(snapshot) })
                syncContent()
            },
        }})
    }

    function removeTextStyle(dom: HTMLElement){
        while(dom.firstChild)dom.parentNode?.insertBefore(dom.firstChild,dom)
        dom.remove()
        syncContent()
    }
        
    //显示占位符
    function loadPlaceholder(){
        if(placeholder && placeholder.trim() != ""){
            const dom = document.createElement('text')
            dom.innerHTML = placeholder
            loadDom([dom])
        }
        //如果占位符为空，则显示空内容
        else{
            textArea.value!.innerText = ""
        }
        
        showPlaceholder.value = true
    }    

    //初始化内容
    onMounted(()=>{
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
        startWatch()
    })

    //向textArea中加载dom
    function loadDom(doms:Node[]|undefined){
        if(!doms){return;}
        //清空
        textArea.value!.innerText = ""
        doms.forEach((dom:any) => {
            textArea.value!.appendChild(dom)
        });
        //如果加载的内容为空，则会尝试加载占位符
        const text = textArea.value!.innerText
        if(text.trim() == ""){
            loadPlaceholder()
        }
        else{
            showPlaceholder.value = false
        }
    }

    //同步前端内容到content中
    function syncContent(){
        var newContent
        //如果是字符串模式则同步字符串内容
        if(mode=="string"){
            newContent = textArea.value?.innerText
            content.value = newContent
        }
        //否则向其中同步文件内容
        else{
            if(!textArea.value)return;
            const nodes = textArea.value!.childNodes
            //content内应当存储文件内容
            const fileContent = translateToFileContent(nodes)
            content.value = fileContent
            newContent = fileContent
        }
        return newContent
    }

    //同步输入，判断输入补全提示
    function onInput(event:Event){
        const inputEvent = event as InputEvent
        //同步输入位置
        const selection = window.getSelection();
        if(selection){
            selectionRange = selection.getRangeAt(0)
        }
        const newInput = inputEvent.data
        listenInput(newInput)
    }
    //输入监听
    function listenInput(newInput:string|null){
        //同步content的内容
        const newContent = syncContent()
        //无效输入内容不添加到有效输入
        if(newInput){
            // 将新的输入内容添加到有效输入
            effectInput += newInput
            // 输入建议功能
            ifInputSuggestion(newInput)
        }
        //执行input事件，返回新的内容和新输入的内容
        emits("input",newContent,newInput)
    }
    //是否需要输入建议
    function ifInputSuggestion(newInput:string){
        //不需要则返回
        if(!inputSuggestionList)return;
        //检查是否存在输入建议
        const content = checkInputSuggestion(inputSuggestionList,effectInput)
        // 有输入建议：显示输入补全框，如果完成了输入提示则进行一次同步
        if(content){
            showInputSuggester({
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
            showInputSuggester({
                input:effectInput,
                "suggestionContent":content2,
                "onInputSuggestion":()=>{
                    syncContent()
                }
            })
        }
        //都还是不行，则清空有效输入并关闭输入建议框
        else{
            hideInputSuggestion()
            effectInput = ""
        }
    }

    //内容监听
    let unWatch:any
    function startWatch(){
        unWatch = watch(content,()=>{ 
            const doms = translateToFrontEndContent(content.value)
            loadDom(doms)
        })
    }
    function stopWatch(){
        if(unWatch && mode!='disabled'){
            unWatch()
        }
    }

    //移动光标到其他位置时清空有效输入,同时记录当前光标位置
    let oldPosition:any
    function clickEvent(){
        //禁用状态忽略
        if(mode=="disabled")return;
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
        //内容为空时显示placeholder
        if(!content.value || toString(content.value).trim()==""){
            loadPlaceholder()
            return false
        }
        else{
            showPlaceholder.value = false
        }
        //开始监听
        startWatch()
        emits("blur",content.value)
    }
    //聚焦
    function onFocus(){
        //取消监听
        stopWatch()
        
        //取消placeholder，如果是禁用模式就不清空
        if(showPlaceholder.value && mode != "disabled"){
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
        emits("focus",content.value)
    }


    //向该输入区中添加一个dom元素
    function addDom(domHTML:string){
        //如果还没有聚焦过，则默认为末尾的位置
        if(!selectionRange){
            focusOnEnd(textArea.value)
        }
        //添加相应class的div并更新selectionRange
		const newRange = addInputLastDiv(domHTML,selectionRange)
        if(newRange){
            selectionRange = newRange
        }
    }
    //向该输入区中添加一段文本
    function addContent(text:string){
        //如果还没有聚焦过，则默认为末尾的位置
        if(!selectionRange){
            focusOnEnd(textArea.value)
        }
        const newRange = addInputLast(text,selectionRange)
        if(newRange){
            selectionRange = newRange
        }
        
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

<style lang="scss">
.textStyleContent.textStyleShake,
.textStylePreview.textStyleShake {
    display:inline-block;
    animation:textStyleShake 0.18s infinite;
    animation-delay:var(--text-style-shake-phase, 0s);
}
@keyframes textStyleShake {
    0%,100% { transform:translate(0,0); }
    12.5% { transform:translate(var(--text-style-shake-x-1), var(--text-style-shake-y-1)); }
    25% { transform:translate(var(--text-style-shake-x-2), var(--text-style-shake-y-2)); }
    37.5% { transform:translate(var(--text-style-shake-x-3), var(--text-style-shake-y-3)); }
    50% { transform:translate(var(--text-style-shake-x-4), var(--text-style-shake-y-4)); }
    62.5% { transform:translate(var(--text-style-shake-x-5), var(--text-style-shake-y-5)); }
    75% { transform:translate(var(--text-style-shake-x-6), var(--text-style-shake-y-6)); }
    87.5% { transform:translate(var(--text-style-shake-x-7), var(--text-style-shake-y-7)); }
    94% { transform:translate(var(--text-style-shake-x-8), var(--text-style-shake-y-8)); }
}
.textStyleContent.textStyleProgressiveBlur,
.textStylePreview.textStyleProgressiveBlur { position:relative; display:inline-block; }
.textStyleProgressiveBlurContent {
    display:inline-block;
    filter:blur(var(--text-style-blur-start, 0px));
    mask-image:linear-gradient(var(--text-style-blur-direction), black 0%, black calc(var(--text-style-blur-center) - 50%), transparent calc(var(--text-style-blur-center) + 50%), transparent 100%);
}
.textStyleProgressiveBlurOverlay {
    position:absolute;
    inset:0;
    filter:blur(var(--text-style-blur));
    mask-image:linear-gradient(var(--text-style-blur-direction), transparent 0%, transparent calc(var(--text-style-blur-center) - 50%), black calc(var(--text-style-blur-center) + 50%), black 100%);
    pointer-events:none;
    white-space:pre-wrap;
}
</style>
