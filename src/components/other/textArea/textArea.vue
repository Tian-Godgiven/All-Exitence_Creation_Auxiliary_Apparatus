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
    @copy="copyArticleContent"
    @paste="pasteArticleContent"
    @beforeinput="beforeArticleInput"
    @input="onInput"
    @blur="onBlur"
    @focus="onFocus">
</div>
</template>

<script setup lang='ts'>
    import { focusOnEnd } from '@/api/focusOnEnd';
    import { showInputSupport } from '@/hooks/inputSupport/inputSupport';
    import { createApp, nextTick, onBeforeUnmount, onMounted, ref, type App, useTemplateRef, watch } from 'vue';
    import { checkInputSuggestion, hideInputSuggestion, InputSuggestionList, showInputSuggester } from '@/supportAbility/inputSuggestion/suggester/inputSuggestion';
    import { addInputLast, addInputLastDiv, deleteInputLast } from '@/api/cursorAbility';
    import { findTargetDivs } from '@/hooks/findTargetDiv';
    import { createTextStyleDom, getTextStyleContentRoot, getTextStyleData, isTextStyleData, isTextStyleDom, setTextStyleDomData, translateToFileContent, translateToFrontEndContent, translateToTextContent, unwrapTextStyleDom, type TextAreaContent, type TextStyleData, type TextStyleEffect, type TextStyleSnapshot } from '@/hooks/expression/textAreaContent';
    import { toString } from 'lodash';
    import { showPopUp } from '@/hooks/pages/popUp';
    import { shallowRef } from 'vue';
    import TextStyleMenu from '@/supportAbility/textStyle/TextStyleMenu.vue';
    import TextStyleInstanceEditor from '@/supportAbility/textStyle/TextStyleInstanceEditor.vue';
    import { makeTextStyleData, normalizeTextStyleSnapshot } from '@/supportAbility/textStyle/textStyle';
    import type { TextStyleMaterial } from '@/supportAbility/textStyle/textStyle';
    import ArticleReaderNode from '@/app/pages/mainPage/components/ArticleReaderNode.vue';

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
    const articleClipboardType = "application/x-all-exitence-article"
    const paragraphEffectReaders = new Map<HTMLElement,{ app:App, host:HTMLElement }>()

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
        removeEmptyParagraphStyles()
        const range = getCurrentRange()
        const styles = getTextStyleTargets(event.target,range)
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
                apply: (material: TextStyleMaterial,scope?: "text" | "paragraph") => configureNewTextStyle(range,styles[0]?.element,material,scope),
                edit: (style: { element: HTMLElement, data: TextStyleData }) => editTextStyle(style),
                remove: (style: { element: HTMLElement, data: TextStyleData }) => removeTextStyle(style,range),
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

    function getTextStyleTargets(target: EventTarget | null,range: Range | null,scope?: "text" | "paragraph"){
        const styles: { element: HTMLElement, data: TextStyleData }[] = []
        if(range && !range.collapsed && textArea.value){
            textArea.value.querySelectorAll<HTMLElement>(".textStyleContent").forEach(element=>{
                const data = getTextStyleData(element)
                if(data && (!scope || getTextStyleScope(data) === scope) && range.intersectsNode(element) && !styles.some(style=>style.data.snapshot.effect === data.snapshot.effect && getTextStyleScope(style.data) === getTextStyleScope(data))){
                    styles.push({ element, data })
                }
            })
            return styles
        }
        let current = target instanceof Node ? target : null
        while(current && current !== textArea.value){
            if(isTextStyleDom(current)){
                const data = getTextStyleData(current)
                if(data && !styles.some(style=>style.data.snapshot.effect === data.snapshot.effect && getTextStyleScope(style.data) === getTextStyleScope(data)))styles.push({ element: current, data })
            }
            current = current.parentNode
        }
        return styles
    }

    function applyTextStyle(range: Range | null,target: HTMLElement | undefined,material: TextStyleMaterial,scope: "text" | "paragraph" = "text"){
        if(!textArea.value)return
        if(scope === "paragraph")range = getParagraphGroupRange(range,target)
        else if(target && (!range || range.collapsed)){
            range = document.createRange()
            const contentRoot = getTextStyleContentRoot(target)
            range.selectNodeContents(contentRoot)
            const spoilerCover = Array.from(contentRoot.children).find(node=>node.classList.contains("textStyleSpoilerCover"))
            if(spoilerCover)range.setEndBefore(spoilerCover)
        }
        if(!range)return
        if(range.collapsed)return
        applyTextStyleSnapshot(range,material.effect,makeTextStyleData(material,[]).snapshot,material.__key,scope)
        syncContent()
    }

    function configureNewTextStyle(range: Range | null,target: HTMLElement | undefined,material: TextStyleMaterial,scope?: "text" | "paragraph"){
        applyTextStyle(range,target,material,scope)
    }

    function editTextStyle(style: { element: HTMLElement, data: TextStyleData }){
        showPopUp({ name: `修改${style.data.snapshot.name}`, vue: shallowRef(TextStyleInstanceEditor), mask: true, buttons: [], size: { height: "auto" }, props: {
            snapshot: style.data.snapshot,
            saveSnapshot: (snapshot: TextStyleSnapshot) => {
                const data = { ...style.data, materialKey: undefined, snapshot: normalizeTextStyleSnapshot(snapshot) }
                setTextStyleDomData(style.element,data)
                syncContent()
            },
        }})
    }

    function removeTextStyle(style: { element: HTMLElement, data: TextStyleData },range: Range | null){
        if(getTextStyleScope(style.data) === "paragraph")unwrapTextStyleDom(style.element)
        else if(range && !range.collapsed){
            const content = range.extractContents()
            removeTextStyleEffect(content,style.data.snapshot.effect,getTextStyleScope(style.data))
            range.insertNode(content)
        }
        else unwrapTextStyleDom(style.element)
        syncContent()
    }

    function applyTextStyleSnapshot(range: Range,effect: TextStyleEffect,snapshot: TextStyleSnapshot,materialKey?: string,scope: "text" | "paragraph" = "text"){
        if(scope === "paragraph" && !range.cloneContents().textContent?.trim())return
        const content = range.extractContents()
        // 同类效果先从选中片段中移除，再重新包裹，避免出现加粗套加粗。
        removeTextStyleEffect(content,effect,scope)
        const data: TextStyleData = { type:"textStyle", scope, materialKey, snapshot, content:[] }
        const dom = createTextStyleDom(data)
        getTextStyleContentRoot(dom).appendChild(content)
        setTextStyleDomData(dom,data)
        range.insertNode(dom)
    }

    function removeTextStyleEffect(content: DocumentFragment,effect: TextStyleEffect,scope: "text" | "paragraph"){
        Array.from(content.querySelectorAll<HTMLElement>(".textStyleContent")).reverse().forEach(dom=>{
            const data = getTextStyleData(dom)
            if(data?.snapshot.effect === effect && getTextStyleScope(data) === scope)unwrapTextStyleDom(dom)
        })
    }

    function getTextStyleScope(data: TextStyleData){ return data.scope ?? "text" }

    function updateParagraphEffectReaders(){
        if(!textStyleEnabled || !textArea.value)return
        const selection = window.getSelection()
        const active = selection?.rangeCount && textArea.value.contains(selection.getRangeAt(0).startContainer)
            ? getParagraphEffectDom(selection.getRangeAt(0).startContainer)
            : null
        refreshParagraphEffectReaders(active)
    }

    function getParagraphEffectDom(node:Node){
        let current:Node|null = node
        while(current && current !== textArea.value){
            if(current instanceof HTMLElement && current.classList.contains("textStyleParagraph"))return current
            current = current.parentNode
        }
        return null
    }

    function refreshParagraphEffectReaders(active:HTMLElement|null){
        if(!textArea.value)return
        Array.from(textArea.value.querySelectorAll<HTMLElement>(".textStyleParagraph")).forEach(dom=>{
            const data = getTextStyleData(dom)
            if(!data || (data.snapshot.effect !== "blur" && data.snapshot.effect !== "opacity"))return
            if(dom === active)removeParagraphEffectReader(dom)
            else addParagraphEffectReader(dom,data)
        })
        Array.from(paragraphEffectReaders.keys()).forEach(dom=>{
            if(!dom.isConnected)removeParagraphEffectReader(dom)
        })
    }

    function addParagraphEffectReader(dom:HTMLElement,data:TextStyleData){
        if(paragraphEffectReaders.has(dom))return
        data = getLiveTextStyleData(dom) ?? data
        const host = document.createElement("div")
        host.className = "paragraphEffectReaderOverlay"
        host.contentEditable = "false"
        host.addEventListener("pointerdown",event=>{
            event.preventDefault()
            event.stopPropagation()
            removeParagraphEffectReader(dom)
            textArea.value?.focus()
            const range = document.createRange()
            range.selectNodeContents(getTextStyleContentRoot(dom))
            range.collapse(false)
            const selection = window.getSelection()
            selection?.removeAllRanges()
            selection?.addRange(range)
            selectionRange = range
        })
        dom.appendChild(host)
        dom.classList.add("paragraphEffectReading")
        const app = createApp(ArticleReaderNode,{ node:data })
        app.mount(host)
        paragraphEffectReaders.set(dom,{ app,host })
    }

    function removeParagraphEffectReader(dom:HTMLElement){
        const reader = paragraphEffectReaders.get(dom)
        if(!reader)return
        reader.app.unmount()
        reader.host.remove()
        dom.classList.remove("paragraphEffectReading")
        paragraphEffectReaders.delete(dom)
    }

    function clearParagraphEffectReaders(){ Array.from(paragraphEffectReaders.keys()).forEach(removeParagraphEffectReader) }

    function getLiveTextStyleData(dom:HTMLElement):TextStyleData|null{
        const content = translateToFileContent([dom])
        return Array.isArray(content) && isTextStyleData(content[0]) ? content[0] : getTextStyleData(dom)
    }

    function getParagraphGroupRange(range:Range|null,target?:HTMLElement){
        const anchor = range?.startContainer ?? target
        const focus = range?.endContainer ?? target
        if(!anchor || !focus || !textArea.value)return null
        const resolveParagraph = (node:Node,first:boolean)=>{
            const own = getArticleParagraph(node)
            if(own)return own
            if(node instanceof HTMLElement){
                const paragraphs = Array.from(node.querySelectorAll<HTMLElement>(".articleParagraph"))
                return first ? paragraphs[0] ?? null : paragraphs[paragraphs.length - 1] ?? null
            }
            return null
        }
        const startParagraph = resolveParagraph(anchor,true)
        const endParagraph = resolveParagraph(focus,false)
        if(!startParagraph || !endParagraph)return null
        const root = textArea.value
        const getRootChild = (node:Node)=>{
            let current:Node = node
            while(current.parentNode && current.parentNode !== root)current = current.parentNode
            return current
        }
        const start = getRootChild(startParagraph)
        const end = getRootChild(endParagraph)
        const children = Array.from(root.childNodes)
        const startIndex = children.indexOf(start)
        const endIndex = children.indexOf(end)
        if(startIndex < 0 || endIndex < 0)return null
        const group = document.createRange()
        group.setStartBefore(children[Math.min(startIndex,endIndex)])
        group.setEndAfter(children[Math.max(startIndex,endIndex)])
        return group
    }

    function removeEmptyParagraphStyles(){
        if(!textArea.value)return
        Array.from(textArea.value.querySelectorAll<HTMLElement>(".textStyleParagraph")).reverse().forEach(dom=>{
            if(!getTextStyleContentRoot(dom).textContent?.trim())unwrapTextStyleDom(dom)
        })
    }
        
    //显示占位符
    function loadPlaceholder(){
        if(textStyleEnabled){
            loadArticleContent([""])
            showPlaceholder.value = false
            return
        }
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
            loadContent()
        }
        startWatch()
        document.addEventListener("selectionchange",updateParagraphEffectReaders)
        nextTick(()=>refreshParagraphEffectReaders(null))
    })

    onBeforeUnmount(()=>{
        document.removeEventListener("selectionchange",updateParagraphEffectReaders)
        clearParagraphEffectReaders()
    })

    //向textArea中加载dom
    function loadDom(doms:Node[]|undefined){
        if(!doms){return;}
        clearParagraphEffectReaders()
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

    function loadContent(){
        if(textStyleEnabled)loadArticleContent(content.value)
        else loadDom(translateToFrontEndContent(content.value))
    }

    // 文章正文固定使用段落容器，避免浏览器把根节点混成裸文本、br 与 div。
    function loadArticleContent(fileContent:any[]|string){
        if(!textArea.value)return
        clearParagraphEffectReaders()
        textArea.value.innerText = ""
        const source = typeof fileContent === "string" ? [fileContent] : fileContent ?? []
        let paragraph:any[] = []
        let afterParagraphEffect = false
        const appendParagraph = ()=>{
            const dom = createArticleParagraph()
            translateToFrontEndContent(paragraph).forEach(node=>dom.appendChild(node))
            textArea.value!.appendChild(dom)
            paragraph = []
        }
        source.forEach(part=>{
            if(part === "\n"){
                if(afterParagraphEffect && !paragraph.length){
                    afterParagraphEffect = false
                    return
                }
                appendParagraph()
                return
            }
            // 段落效果本身是正文根级块，内部管理它覆盖的完整段落。
            if(part && typeof part === "object" && part.type === "textStyle" && part.scope === "paragraph"){
                if(paragraph.length)appendParagraph()
                const doms = translateToFrontEndContent([part])
                doms.forEach(dom=>textArea.value!.appendChild(dom))
                afterParagraphEffect = true
                return
            }
            afterParagraphEffect = false
            paragraph.push(part)
        })
        if(paragraph.length || !textArea.value.childNodes.length)appendParagraph()
    }

    function createArticleParagraph(){
        const paragraph = document.createElement("div")
        paragraph.className = "articleParagraph"
        return paragraph
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
            const fileContent = textStyleEnabled ? translateArticleContent() : translateToFileContent(textArea.value!.childNodes)
            content.value = fileContent
            newContent = fileContent
        }
        return newContent
    }

    function translateArticleContent(){
        if(!textArea.value)return []
        const blocks = Array.from(textArea.value.childNodes).flatMap(node=>{
            if(node instanceof HTMLElement && node.classList.contains("articleParagraph"))return [asContentArray(translateToFileContent(node.childNodes))]
            if(isTextStyleDom(node) && getTextStyleData(node)?.scope === "paragraph")return [asContentArray(translateToFileContent([node]))]
            return [asContentArray(translateToFileContent([node]))]
        })
        return flattenArticleParagraphs(blocks)
    }

    function getArticleParagraphContents(nodes:Node[]):TextAreaContent[][]{
        const paragraphs:Node[][] = []
        let current:Node[] = []
        const pushCurrent = ()=>{ paragraphs.push(current); current = [] }
        nodes.forEach(node=>{
            if(node.nodeName === "BR"){
                pushCurrent()
                return
            }
            // 浏览器在 Enter 后生成的 div 也视为独立逻辑段落。
            if(node instanceof HTMLElement && node.nodeName === "DIV" && !isTextStyleDom(node)){
                if(current.length)pushCurrent()
                paragraphs.push(Array.from(node.childNodes))
                return
            }
            current.push(node)
        })
        if(current.length || !paragraphs.length)pushCurrent()
        return paragraphs.map(paragraph=>asContentArray(translateToFileContent(paragraph)))
    }

    function flattenArticleParagraphs(paragraphs:TextAreaContent[][]){
        return paragraphs.flatMap((paragraph,index)=>[
            ...paragraph,
            ...(index < paragraphs.length - 1 ? ["\n"] : []),
        ])
    }

    function asContentArray(value:any){ return typeof value === "string" ? value ? [value] : [] : value }

    function copyArticleContent(event: ClipboardEvent){
        if(!textStyleEnabled)return
        const range = getCurrentRange()
        if(!range || range.collapsed || !event.clipboardData)return
        const content = range.cloneContents()
        unwrapParagraphEffectsInFragment(content)
        const paragraphs = getArticleParagraphContents(Array.from(content.childNodes))
        event.clipboardData.setData(articleClipboardType,JSON.stringify({ paragraphs }))
        event.clipboardData.setData("text/plain",paragraphs.map(paragraph=>translateToTextContent(paragraph)).join("\n"))
        event.preventDefault()
    }

    function unwrapParagraphEffectsInFragment(content:DocumentFragment){
        Array.from(content.querySelectorAll<HTMLElement>(".textStyleParagraph")).reverse().forEach(dom=>{
            const contentRoot = getTextStyleContentRoot(dom)
            const parent = dom.parentNode
            if(!parent)return
            Array.from(contentRoot.childNodes).forEach(node=>parent.insertBefore(node,dom))
            dom.remove()
        })
    }

    function pasteArticleContent(event: ClipboardEvent){
        if(!textStyleEnabled || !event.clipboardData)return
        const range = getCurrentRange()
        if(!range)return
        const internal = readArticleClipboard(event.clipboardData.getData(articleClipboardType))
        const paragraphs = internal ?? event.clipboardData.getData("text/plain").replace(/\r\n?/g,"\n").split("\n").map(text=>text ? [text] : [])
        event.preventDefault()
        insertArticleParagraphs(range,paragraphs)
        syncContent()
    }

    function readArticleClipboard(value:string):TextAreaContent[][]|null{
        if(!value)return null
        try{
            const data = JSON.parse(value)
            return Array.isArray(data?.paragraphs) && data.paragraphs.every((paragraph:any)=>Array.isArray(paragraph)) ? data.paragraphs : null
        }
        catch{return null}
    }

    function insertArticleParagraphs(range:Range,paragraphs:TextAreaContent[][]){
        if(!textArea.value)return
        const root = textArea.value
        const start = getArticleParagraph(range.startContainer)
        const end = getArticleParagraph(range.endContainer)
        if(!start || !end || start.parentNode !== root || end.parentNode !== root){
            range.deleteContents()
            const content = document.createDocumentFragment()
            paragraphs.forEach((paragraph,index)=>{
                if(index)content.appendChild(document.createElement("br"))
                translateToFrontEndContent(paragraph).forEach(node=>content.appendChild(node))
            })
            range.insertNode(content)
            return
        }
        const prefixRange = document.createRange()
        prefixRange.selectNodeContents(start)
        prefixRange.setEnd(range.startContainer,range.startOffset)
        const suffixRange = document.createRange()
        suffixRange.selectNodeContents(end)
        suffixRange.setStart(range.endContainer,range.endOffset)
        const prefix = prefixRange.cloneContents()
        const suffix = suffixRange.cloneContents()
        const directParagraphs = Array.from(root.children)
        const startIndex = directParagraphs.indexOf(start)
        const endIndex = directParagraphs.indexOf(end)
        const replacements = (paragraphs.length ? paragraphs : [[]]).map(content=>{
            const paragraph = createArticleParagraph()
            translateToFrontEndContent(content).forEach(node=>paragraph.appendChild(node))
            return paragraph
        })
        replacements[0].prepend(prefix)
        replacements[replacements.length - 1].append(suffix)
        const insertion = document.createDocumentFragment()
        replacements.forEach(paragraph=>insertion.appendChild(paragraph))
        root.insertBefore(insertion,start)
        directParagraphs.slice(startIndex,endIndex + 1).forEach(paragraph=>paragraph.remove())
        const caret = document.createRange()
        caret.selectNodeContents(replacements[replacements.length - 1])
        caret.collapse(false)
        window.getSelection()?.removeAllRanges()
        window.getSelection()?.addRange(caret)
    }

    function getArticleParagraph(node:Node){
        let current:Node|null = node
        while(current && current !== textArea.value){
            if(current instanceof HTMLElement && current.classList.contains("articleParagraph"))return current
            current = current.parentNode
        }
        return null
    }

    //同步输入，判断输入补全提示
    function onInput(event:Event){
        normalizeArticleParagraphMarkers()
        const inputEvent = event as InputEvent
        //同步输入位置
        const selection = window.getSelection();
        if(selection){
            selectionRange = selection.getRangeAt(0)
        }
        const newInput = inputEvent.data
        listenInput(newInput)
        nextTick(updateParagraphEffectReaders)
    }

    function beforeArticleInput(event: InputEvent){
        if(!textStyleEnabled)return
        const range = getCurrentRange()
        if(!range)return
        if(event.inputType === "insertParagraph"){
            event.preventDefault()
            splitArticleParagraph(range)
            syncContent()
            return
        }
        if(!range.collapsed || !["deleteContentBackward","deleteContentForward"].includes(event.inputType))return
        const paragraph = getArticleParagraph(range.startContainer)
        if(!paragraph)return
        const backward = event.inputType === "deleteContentBackward"
        if(backward ? !isRangeAtParagraphStart(range,paragraph) : !isRangeAtParagraphEnd(range,paragraph))return
        const adjacent = getAdjacentArticleParagraph(paragraph,backward ? -1 : 1)
        if(!adjacent || getParagraphEffectDom(adjacent) === getParagraphEffectDom(paragraph))return
        event.preventDefault()
        moveCursorToArticleParagraph(adjacent,backward ? "end" : "start")
    }

    function isRangeAtParagraphStart(range:Range,paragraph:HTMLElement){
        const prefix = document.createRange()
        prefix.selectNodeContents(paragraph)
        prefix.setEnd(range.startContainer,range.startOffset)
        return !prefix.cloneContents().textContent
    }

    function isRangeAtParagraphEnd(range:Range,paragraph:HTMLElement){
        const suffix = document.createRange()
        suffix.selectNodeContents(paragraph)
        suffix.setStart(range.startContainer,range.startOffset)
        return !suffix.cloneContents().textContent
    }

    function getAdjacentArticleParagraph(paragraph:HTMLElement,direction:-1|1){
        const effect = getParagraphEffectDom(paragraph)
        const contentRoot = effect ? getTextStyleContentRoot(effect) : textArea.value
        if(!contentRoot)return null
        const siblings = Array.from(contentRoot.children).filter(node=>node.classList.contains("articleParagraph"))
        const index = siblings.indexOf(paragraph)
        const inner = siblings[index + direction]
        if(inner)return inner
        const block = effect ?? paragraph
        const parent = block.parentNode
        if(!parent)return null
        const blocks = Array.from(parent.childNodes)
        const blockIndex = blocks.indexOf(block)
        for(let nextIndex=blockIndex + direction;nextIndex>=0 && nextIndex<blocks.length;nextIndex += direction){
            const target = findArticleParagraphInBlock(blocks[nextIndex],direction)
            if(target)return target
        }
        return null
    }

    function findArticleParagraphInBlock(block:Node,direction:-1|1){
        if(block instanceof HTMLElement && block.classList.contains("articleParagraph"))return block
        if(!(block instanceof HTMLElement))return null
        const paragraphs = Array.from(block.querySelectorAll<HTMLElement>(".articleParagraph"))
        return direction < 0 ? paragraphs[paragraphs.length - 1] ?? null : paragraphs[0] ?? null
    }

    function moveCursorToArticleParagraph(paragraph:HTMLElement,edge:"start"|"end"){
        const effect = getParagraphEffectDom(paragraph)
        if(effect)removeParagraphEffectReader(effect)
        textArea.value?.focus()
        const range = document.createRange()
        range.selectNodeContents(paragraph)
        range.collapse(edge === "start")
        const selection = window.getSelection()
        selection?.removeAllRanges()
        selection?.addRange(range)
        selectionRange = range
    }

    function splitArticleParagraph(range:Range){
        const paragraph = getArticleParagraph(range.startContainer)
        if(!paragraph)return
        if(!range.collapsed){
            range.deleteContents()
            range.collapse(true)
        }
        const suffixRange = document.createRange()
        suffixRange.selectNodeContents(paragraph)
        suffixRange.setStart(range.startContainer,range.startOffset)
        const suffix = suffixRange.extractContents()
        const nextParagraph = createArticleParagraph()
        nextParagraph.appendChild(suffix)
        const effect = getParagraphEffectDom(paragraph)
        const effectContent = effect ? getTextStyleContentRoot(effect) : null
        const effectParagraphs = effectContent ? Array.from(effectContent.children).filter(node=>node.classList.contains("articleParagraph")) : []
        const isLastEffectParagraph = !!effect && effectParagraphs[effectParagraphs.length - 1] === paragraph
        if(isLastEffectParagraph && effect)effect.parentNode?.insertBefore(nextParagraph,effect.nextSibling)
        else paragraph.parentNode?.insertBefore(nextParagraph,paragraph.nextSibling)
        const caret = document.createRange()
        caret.setStart(nextParagraph,0)
        caret.collapse(true)
        const selection = window.getSelection()
        selection?.removeAllRanges()
        selection?.addRange(caret)
        selectionRange = caret
    }

    function normalizeArticleParagraphMarkers(){
        if(!textStyleEnabled || !textArea.value)return
        Array.from(textArea.value.children).forEach(node=>{
            if(node.nodeName === "DIV" && !isTextStyleDom(node))node.classList.add("articleParagraph")
        })
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
            loadContent()
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
        nextTick(updateParagraphEffectReaders)
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
        refreshTextStyleCharacters()
        refreshParagraphEffectReaders(null)
        //开始监听
        startWatch()
        emits("blur",content.value)
    }

    function refreshTextStyleCharacters(){
        if(!textArea.value)return
        textArea.value.querySelectorAll<HTMLElement>(".textStyleContent").forEach((dom)=>{
            const data = getLiveTextStyleData(dom)
            if(data)setTextStyleDomData(dom,data)
        })
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
        nextTick(updateParagraphEffectReaders)
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
		color: $textColor;
		background-color: $bgColor;
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
			text-decoration-color: $previewText!important;
			color:$previewText!important;
        }
    }
</style>

<style lang="scss">
.textArea > .articleParagraph { min-height:1.4em; }
.textStyleContent.textStyleShake,
.textStyleCharacter.textStyleShake,
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
.textStylePreview.textStyleProgressiveBlur { position:relative; display:inline-block; }
.textStyleContent.textStyleParagraph { display:block; width:auto; }
.textStyleContent.textStyleParagraph { position:relative; }
.textStyleContent.textStyleParagraph .articleParagraph { min-height:1.4em; }
.textStyleParagraph.paragraphEffectReading > :not(.paragraphEffectReaderOverlay) { opacity:0; }
.paragraphEffectReaderOverlay { position:absolute; inset:0; z-index:2; cursor:text; }
.textStylePreview.textStyleProgressiveOpacity {
    mask-image:linear-gradient(var(--text-style-opacity-direction), rgb(0 0 0 / var(--text-style-opacity-start)) 0%, rgb(0 0 0 / var(--text-style-opacity-start)) var(--text-style-opacity-center), rgb(0 0 0 / var(--text-style-opacity)) 100%);
    mask-size:var(--text-style-content-width, 100%) 100%;
    mask-repeat:no-repeat;
}
.textStyleContent.textStyleSpoiler,
.textStylePreview.textStyleSpoiler { position:relative; display:inline-block; cursor:help; }
.textStyleSpoilerCover {
    position:absolute;
    inset:0;
    display:block;
    overflow:hidden;
    border-radius:2px;
    background:$antiBgColor;
    color:transparent;
    user-select:none;
}
.textStyleSpoiler:not(.textStyleSpoilerClick):hover .textStyleSpoilerCover,
.textStyleSpoiler.revealed .textStyleSpoilerCover { display:none; }
.textArea[contenteditable="true"] .textStyleSpoilerCover { display:none; }
.textArea[contenteditable="true"] .textStyleSpoiler {
    padding:0 2px;
    border-radius:2px;
    background:$antiBgColor;
    color:$bgColor!important;
}
.textStylePreview .textStyleProgressiveBlurContent {
    display:inline-block;
    filter:blur(var(--text-style-blur-start, 0px));
    mask-image:linear-gradient(var(--text-style-blur-direction), black 0%, black calc(var(--text-style-blur-center) - 50%), transparent calc(var(--text-style-blur-center) + 50%), transparent 100%);
    mask-size:var(--text-style-content-width, 100%) 100%;
    mask-repeat:no-repeat;
}
.textStylePreview .textStyleProgressiveBlurOverlay {
    position:absolute;
    inset:0;
    filter:blur(var(--text-style-blur));
    mask-image:linear-gradient(var(--text-style-blur-direction), transparent 0%, transparent calc(var(--text-style-blur-center) - 50%), black calc(var(--text-style-blur-center) + 50%), black 100%);
    mask-size:var(--text-style-content-width, 100%) 100%;
    mask-repeat:no-repeat;
    pointer-events:none;
    white-space:pre-wrap;
}
</style>
