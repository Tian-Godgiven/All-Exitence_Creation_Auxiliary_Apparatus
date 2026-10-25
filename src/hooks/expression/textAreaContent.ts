import { divWeakMap } from "@/api/cursorAbility";
import { isJumpDiv, JumpData, jumpDivHtml } from "../../supportAbility/inputSuggestion/suggester/jumpDiv";
import { showQuickInfo } from "@/api/showQuickInfo";
import { isArray, toString } from "lodash";

export type TextStyleEffect = "fontWeight" | "italic" | "color" | "shake" | "blur" | "offset"
export type TextStyleShakeDirection = { x: number, y: number }
export type TextStyleDirection = "up" | "upRight" | "right" | "downRight" | "down" | "downLeft" | "left" | "upLeft"
export type TextStyleShakeValue = { strength: number, frequency: number, regularity: number, synchronized: boolean, directions: TextStyleDirection[], phase?: number, path?: TextStyleShakeDirection[] }
export type TextStyleBlurValue = { amount: number, startAmount: number, progressive: boolean, direction: TextStyleDirection, center: number }
export const textStyleDirections:{ value:TextStyleDirection, label:string, short:string, x:number, y:number, css:string }[] = [
    { value:"up",label:"向上",short:"上",x:0,y:-1,css:"to top" }, { value:"upRight",label:"右上",short:"右上",x:1,y:-1,css:"to top right" },
    { value:"right",label:"向右",short:"右",x:1,y:0,css:"to right" }, { value:"downRight",label:"右下",short:"右下",x:1,y:1,css:"to bottom right" },
    { value:"down",label:"向下",short:"下",x:0,y:1,css:"to bottom" }, { value:"downLeft",label:"左下",short:"左下",x:-1,y:1,css:"to bottom left" },
    { value:"left",label:"向左",short:"左",x:-1,y:0,css:"to left" }, { value:"upLeft",label:"左上",short:"左上",x:-1,y:-1,css:"to top left" },
]

// 每种效果只保存自身的参数，避免一个效果混入不相关的文字样式。
export type TextStyleSnapshot =
    | { effect: "fontWeight", name: string, value: number }
    | { effect: "italic", name: string, value: true }
    | { effect: "color", name: string, value: string }
    | { effect: "shake", name: string, value: TextStyleShakeValue }
    | { effect: "blur", name: string, value: TextStyleBlurValue }
    | { effect: "offset", name: string, value: number }

// 文字效果保存应用当时的快照；materialKey 用于用户主动同步素材库改动。
export type TextStyleData = {
    type: "textStyle",
    materialKey?: string,
    snapshot: TextStyleSnapshot,
    content: TextAreaContent[],
}

//输入区域的内容对象为纯文本、跳转对象或文字样式对象
export type TextAreaContent = string | JumpData | TextStyleData

const textStyleClassName = "textStyleContent"

export function isTextStyleData(value: unknown): value is TextStyleData{
    return !!value && typeof value === "object" && (value as TextStyleData).type === "textStyle" && Array.isArray((value as TextStyleData).content)
}

export function isTextStyleDom(node: Node): node is HTMLElement{
    return node instanceof HTMLElement && node.classList.contains(textStyleClassName)
}

export function getTextStyleData(node: HTMLElement): TextStyleData | null{
    const encoded = node.dataset.textStyle
    if(!encoded)return null
    try{
        const data = JSON.parse(decodeURIComponent(encoded))
        return isTextStyleData(data) ? data : null
    }
    catch(error){
        console.error("无法读取文字效果",error)
        return null
    }
}

export function createTextStyleDom(data: TextStyleData): HTMLElement{
    const dom = document.createElement("span")
    dom.className = textStyleClassName
    setTextStyleDomData(dom,data)
    const contentRoot = getProgressiveBlurContent(dom) ?? dom
    translateToFrontEndContent(data.content).forEach(node=>contentRoot.appendChild(node))
    refreshProgressiveBlurOverlay(dom)
    return dom
}

export function setTextStyleDomData(dom: HTMLElement,data: TextStyleData){
    dom.dataset.textStyle = encodeURIComponent(JSON.stringify(data))
    dom.classList.toggle("textStyleShake",data.snapshot.effect === "shake")
    dom.style.fontWeight = data.snapshot.effect === "fontWeight" ? String(data.snapshot.value) : ""
    dom.style.fontStyle = data.snapshot.effect === "italic" ? "italic" : ""
    dom.style.color = data.snapshot.effect === "color" ? String(data.snapshot.value) : ""
    dom.classList.toggle("textStyleProgressiveBlur",data.snapshot.effect === "blur" && data.snapshot.value.progressive)
    if(data.snapshot.effect === "blur" && data.snapshot.value.progressive)ensureProgressiveBlurContent(dom)
    else removeProgressiveBlurContent(dom)
    dom.style.filter = data.snapshot.effect === "blur" && !data.snapshot.value.progressive ? `blur(${data.snapshot.value.amount}px)` : ""
    dom.style.setProperty("--text-style-blur",data.snapshot.effect === "blur" ? `${data.snapshot.value.amount}px` : "0px")
    dom.style.setProperty("--text-style-blur-start",data.snapshot.effect === "blur" ? `${data.snapshot.value.startAmount ?? 0}px` : "0px")
    dom.style.setProperty("--text-style-blur-direction",data.snapshot.effect === "blur" ? getDirectionCss(data.snapshot.value.direction) : "to right")
    dom.style.setProperty("--text-style-blur-center",data.snapshot.effect === "blur" ? `${data.snapshot.value.center}%` : "50%")
    if(data.snapshot.effect === "shake"){
        const value = data.snapshot.value
        const path = getShakePath(value)
        dom.style.setProperty("--text-style-shake-phase",`${value.synchronized ? 0 : value.phase ?? 0}s`)
        dom.style.animationDuration = `${1 / (value.frequency || 5.5)}s`
        path.forEach((direction,index)=>{
            dom.style.setProperty(`--text-style-shake-x-${index + 1}`,`${direction.x * value.strength}px`)
            dom.style.setProperty(`--text-style-shake-y-${index + 1}`,`${direction.y * value.strength}px`)
        })
    }
    else{
        dom.style.animationDuration = ""
        dom.style.removeProperty("--text-style-shake-phase")
        for(let index=1;index<=8;index++){
            dom.style.removeProperty(`--text-style-shake-x-${index}`)
            dom.style.removeProperty(`--text-style-shake-y-${index}`)
        }
    }
}

export function getTextStyleCss(snapshot: TextStyleSnapshot){
    if(snapshot.effect === "fontWeight")return { fontWeight: snapshot.value }
    if(snapshot.effect === "italic")return { fontStyle: "italic" }
    if(snapshot.effect === "color")return { color: snapshot.value }
    if(snapshot.effect === "blur")return snapshot.value.progressive ? { "--text-style-blur": `${snapshot.value.amount}px`, "--text-style-blur-start": `${snapshot.value.startAmount ?? 0}px`, "--text-style-blur-direction":getDirectionCss(snapshot.value.direction), "--text-style-blur-center":`${snapshot.value.center}%` } : { filter: `blur(${snapshot.value.amount}px)` }
    if(snapshot.effect === "offset")return {}
    const shake = snapshot.value
    const path = getPreviewShakePath(shake)
    return Object.assign({ "--text-style-shake-phase": `${shake.synchronized ? 0 : shake.phase ?? -0.1}s`, animationDuration:`${1 / (shake.frequency || 5.5)}s`, display: "inline-block" },...path.map((direction,index)=>({ [`--text-style-shake-x-${index + 1}`]:`${direction.x * shake.strength}px`,[`--text-style-shake-y-${index + 1}`]:`${direction.y * shake.strength}px` })))
}

function getShakePath(value: TextStyleShakeValue): TextStyleShakeDirection[]{
    return value.path?.length === 8 ? value.path : getPreviewShakePath(value)
}

function getPreviewShakePath(value: TextStyleShakeValue): TextStyleShakeDirection[]{
    const allowed = textStyleDirections.filter(item=>value.directions?.includes(item.value))
    const enabled = allowed.length ? allowed : textStyleDirections
    const irregularity = 1 - value.regularity / 100
    return Array.from({ length:8 },(_,index)=>{
        const roll = ((index * 37 + 17) % 100) / 100
        const direction = roll >= irregularity ? enabled[index % enabled.length] : enabled[(index * 5 + 3) % enabled.length]
        return { x:direction.x,y:direction.y }
    })
}

export function getDirectionCss(direction: TextStyleDirection): string{
    return textStyleDirections.find(item=>item.value === direction)?.css ?? "to right"
}

//将前端显示的节点转换为文件内容
export function translateToFileContent(frontEndNodes:NodeListOf<ChildNode>|ChildNode[]){
    const fileContent:TextAreaContent[] = []
    //遍历前端内容
    try{
    frontEndNodes.forEach((node) => {
        if(isTextStyleDom(node)){
            const data = getTextStyleData(node)
            if(data){
                refreshProgressiveBlurOverlay(node)
                const contentRoot = getProgressiveBlurContent(node) ?? node
                fileContent.push({...data,content:translateToFileContent(contentRoot.childNodes) as TextAreaContent[]})
            }
        }
        //jumpDiv类型
        else if(isJumpDiv(node)){
            //获取div相关的数据
            const data = divWeakMap.get(node)
            if(!data){
                showQuickInfo("没有获取到div相关的跳转数据")
                return;
            };
            //额外存储node的文本内容为text
            data.text = node.innerText
            fileContent.push(data)
        }
        //如果是br，则添加一个\n符
        else if(node.nodeName == "BR"){
            fileContent.push("\n")
        }
        //如果是text或者其他div则获取其中的文本
        else if(node instanceof Text){
            const inner = node.data
            fileContent.push(inner)
        }
        else if(node instanceof HTMLElement){
            const inner = node.innerText
            //如果是div，要额外添加一个换行
            if(node.nodeName == "DIV" && inner != "\n"){
                fileContent.push("\n")
            }
            if(inner && inner != ""){
                fileContent.push(inner)
            }
        }
        
    });
    }
    catch(err){
        console.error(err)
    }
    //如果最终里面只有一个换行，则认为其为空
    if(fileContent.length == 1 && fileContent[0] == "\n"){
        return ""
    }
    return fileContent
}

function getProgressiveBlurContent(dom: HTMLElement): HTMLElement | null{
    return Array.from(dom.children).find(child=>child.classList.contains("textStyleProgressiveBlurContent")) as HTMLElement | null
}

function ensureProgressiveBlurContent(dom: HTMLElement): HTMLElement{
    const existing = getProgressiveBlurContent(dom)
    if(existing)return existing
    const content = document.createElement("span")
    content.className = "textStyleProgressiveBlurContent"
    const overlay = document.createElement("span")
    overlay.className = "textStyleProgressiveBlurOverlay"
    overlay.setAttribute("aria-hidden","true")
    while(dom.firstChild)content.appendChild(dom.firstChild)
    dom.append(content,overlay)
    return content
}

function removeProgressiveBlurContent(dom: HTMLElement){
    const content = getProgressiveBlurContent(dom)
    if(!content)return
    const overlay = Array.from(dom.children).find(child=>child.classList.contains("textStyleProgressiveBlurOverlay"))
    while(content.firstChild)dom.insertBefore(content.firstChild,content)
    content.remove()
    overlay?.remove()
}

function refreshProgressiveBlurOverlay(dom: HTMLElement){
    if(!dom.classList.contains("textStyleProgressiveBlur"))return
    const content = getProgressiveBlurContent(dom)
    const overlay = Array.from(dom.children).find(child=>child.classList.contains("textStyleProgressiveBlurOverlay")) as HTMLElement | null
    if(content && overlay)overlay.textContent = content.innerText
}

//将文件内容翻译为前端内容数组
export function translateToFrontEndContent(fileContent:any[]|string){
    if(!fileContent)return [];
    //如果文件里只保存了一个字符串，则直接返回它
    if(typeof fileContent == "string"){
        const textNode = document.createTextNode(fileContent)
        return [textNode]
    }
    else if(!isArray(fileContent)){
        console.error(fileContent)
        throw new Error("文件对象为非数组或单独的字符串")
    }
    const frontEndContent:any[] = []
    //遍历文件内容
    for(let data of fileContent){
        //如果是字符串
        if(typeof data == "string"){
            if(data == "\n"){
                const brNode = document.createElement("br")
                frontEndContent.push(brNode)
            }
            else{
                //作为text放入
                const textNode = document.createTextNode(data)
                frontEndContent.push(textNode)
            }
        }
        else if(isTextStyleData(data)){
            frontEndContent.push(createTextStyleDom(data))
        }
        //跳转对象
        else{
            //获取跳转div
            const divHtml = jumpDivHtml(data)
            if(divHtml==false){
                continue;
            }
            let div:any = document.createElement('div');
            div.innerHTML = divHtml; // 将 HTML 转换为 DOM 节点
            div = div.firstChild
            if(!div) return;
            // 为div绑定Weakmap数据
            divWeakMap.set(div, data);
            // 添加这个跳转div
            frontEndContent.push(div)
        }
    }

    return frontEndContent
}

//将文件内容翻译为文本内容(txt),如果指定为短文本则会用空格替代换行
export function translateToTextContent(fileContent:any[],short:boolean=false){
    let textContent = ""
    if(typeof fileContent == "string" || typeof fileContent == "number"){
        return toString(fileContent)
    }
    try{
        //遍历文件内容
        fileContent.forEach((part:any)=>{
            //如果是字符串
            if(typeof part == "string"){
                //短文本加个空格
                if(part == "\n" && short){
                    textContent += " "
                }
                else{
                    textContent += part
                }
            }
            else if(isTextStyleData(part)){
                textContent += translateToTextContent(part.content,short)
            }
            //跳转对象
            else{
                //只要Inner
                textContent += part.text
            }
        })
    }
    catch(err){
        console.log(fileContent)
        console.error(err)
    }

    //只有一个换行的情况
    if(textContent == "\n"){
        return ""
    }

    return textContent
}
