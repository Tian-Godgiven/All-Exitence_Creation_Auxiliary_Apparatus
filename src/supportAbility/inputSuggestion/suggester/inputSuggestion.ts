import { addInputLastDiv, deleteInputLast, getInputPosition} from "@/api/cursorAbility";
import { addInputLast } from "@/api/cursorAbility"
import { globalInputSuggestionList, projectInputSuggestionList } from "@/supportAbility/inputSuggestion/main";
import { ref } from "vue";
import { ExitenceJumpData, jumpDivHtml } from "./jumpDiv";
import { Type } from "@/class/Type";
import { Exitence } from "@/class/Exitence";
import { getExitenceStatusByKey } from "@/hooks/all-exitence/allExitence";
import { translateToTextContent } from "@/hooks/expression/textAreaContent";
import { isString } from "lodash";

//组件中的通用输入建议单元
export interface SuggestionItem{
    text:string,
    type:"string"|"exitence",
    info?:string,
    showText?:string,
    target?:any,
    attr?:any,
    click?:(input:string,item:SuggestionItem)=>void
}
//文件中存储的字符串输入建议单元
export interface StringItem{
    text:string,//字符串文本
    attr?:any,//标识该输入建议单元的内容
    showText?:string,//显示在输入建议的标题内容
    info?:string,//显示在输入建议的解释性信息
    click?:(input:string,item:SuggestionItem)=>void, //点击该输入提示项的事件
}
//输入建议单元in文件：事物
export interface ExitenceItem{
    text:string,//事物的名称
    target:string,//事物所在的分类的key
    info?:string//说明性文本
    manual?:{text:string,info?:string}[], //手动创建的事物输入提示关键字 
    nickName?:string[] //事物的别名数组
    click?:(input:string,item:SuggestionItem)=>void
}
//输入建议列表in文件
export interface InputSuggestionList{
    string:StringItem[],
    exitence:{ 
        [key:string]:ExitenceItem
    },
}

//提示器所使用的变量
export const content = ref<SuggestionItem[]>([])// 输入提示div内所需要显示的内容
export const ifShow = ref(false)// 是否显示输入提示
export const positionCSS = ref({left:0,top:0})// 输入提示的位置
export const inputText = ref("")//已经输入了的内容
export const inputSuggestionEvent = ref(()=>{})// 完成输入提示时的回调事件

//根据名称获取目标输入建议表
export function getInputSuggestionList(name:"project"|"global"|"all"):InputSuggestionList{
    //分别返回项目/全局/所有的输入建议表
    switch(name){
        case "project":
            return projectInputSuggestionList;
        case "global":
            return globalInputSuggestionList;
        case "all":
            const all = {...globalInputSuggestionList,...projectInputSuggestionList}
            return all
        }
}

//创建一个直接在组件中使用的输入建议表
export function createInputSuggestionList<T>(stringType?:{
    itemList:T[],
    text:(item:T)=>string,
    showText?:(item:T)=>string,
    attr:string|((item:T)=>string),
    click?:(item:T,input:string)=>void,//不会进行基础的补全行为
    info?:(item:T)=>string
},exitenceType?:{
    exitenceList:Exitence[],
    text?:(exitence:Exitence)=>string,
    info?:(exitence:Exitence)=>string, 
    nickName?:(exitence:Exitence)=>string[],
    manual?:(exitence:Exitence)=>({text:string,info?:string}[]),
    click?:(exitence:Exitence,input:string)=>void //会覆盖点击弹出事物弹窗的效果
}):InputSuggestionList{
    //生成字符串类型列表
    const stringList = createStringTypeInputSuggestionList(stringType)
        ??[]
    //生成事物类型列表
    const exitenceList = createExitenceTypeInputSuggestionList(exitenceType)
        ??{}
    return {
        string:stringList,
        exitence:exitenceList
    }
}
function createStringTypeInputSuggestionList<T>(stringType?:{
    itemList:T[],
    text:(item:T)=>string,
    showText?:(item:T)=>string,
    attr:string|((item:T)=>string),
    click?:(item:T,input:string)=>void,//不会进行基础的补全行为
    info?:(item:T)=>string
}){
    if(!stringType)return;
    const {itemList,text,showText,attr,click,info} = stringType
    return itemList.map(item=>{
        const typeValue = typeof attr == "string" ? attr : attr(item)
        const tmp:StringItem = {
            text:text(item),
            attr:typeValue,
        }
        if(click){
            tmp.click = (input)=>{
            //触发对应的方法,覆盖原本的补全行为
            click(item,input)
        }}
        if(showText){
            tmp["showText"] = showText(item)
        }
        if(info){
            tmp.info = info(item)
        }
        return tmp
    })
}
function createExitenceTypeInputSuggestionList(exitenceType?:{
    exitenceList:Exitence[],
    text?:(exitence:Exitence)=>string,
    info?:(exitence:Exitence)=>string, 
    manual?:(exitence:Exitence)=>({text:string,info?:string}[])
    nickName?:(exitence:Exitence)=>string[],
    click?:(exitence:Exitence,input:string)=>void //会覆盖点击弹出事物弹窗的效果
}){
    if(!exitenceType)return;
    const {exitenceList,text,info,manual, nickName,click} = exitenceType
    const exitences:Record<string,ExitenceItem> = {}
    exitenceList.forEach(exitence=>{
        const tmp:ExitenceItem = {
            text:text?text(exitence):exitence.name,//text的返回值or事物名称
            target:exitence.typeKey,
        }
        if(info){tmp.info = info(exitence)}
        if(manual){tmp.manual = manual(exitence)}
        if(nickName){tmp.nickName = nickName(exitence)}
        if(click){tmp.click = (input)=>{
            click(exitence,input)
        }}
        exitences[exitence.__key] = tmp
    })
    return exitences
}

//点击一个输入提示对象
export function clickSuggestionItem(item:SuggestionItem){
    const input = inputText.value
    //如果存在click，则会用click替代
    if(item.click){
        switch(item.type){
            case "string":
                item.click(input,item)
                break;
            case "exitence":
                item.click(input,item)
        }
        return;
    }
    switch(item.type){
        //字符串自动补全
        case "string":
            autoComplete(input,item.text)
            break
        //事物补全div并创建跳转div
        case "exitence":
            //事物跳转对象的跳转数据
            const exitenceData:ExitenceJumpData = {
                text:item.text,
                target:item.target,
                type:"exitence",
            }
            //如果这是一个别名
            if(item?.attr == "nickName"){
                exitenceData["nickName"] = true
            }
            //自动补全一个跳转div
            autoCompleteJumpDiv(input,exitenceData)
            break;
        default:
            console.error("错误：未定义的输入建议类型")
    }
}

//组合两个输入提示表
export function mergeInputSuggestionList(list1:InputSuggestionList,list2:InputSuggestionList){
    return {
        string:[...list1.string,...list2.string],
        exitence:{
            ...list1.exitence,
            ...list2.exitence
        }
    }
}

//获取目标列表
function getTargetList(type:string,position?:"global"|"project"):InputSuggestionList{
    //若没有指定输入提示表位置，则根据类型判断
    if(!position){
        if(type == "exitence"){
            position = "project"
        }
        else{
            position = "global"
        }
    }
    //获取目标列表
    const list:any = (position == "global"? globalInputSuggestionList : projectInputSuggestionList)
    return list
}

//向输入提示表中新增字符串类输入建议项
export function addStringSuggestion(item:StringItem,position?:"global"|"project"){
    const list = getTargetList("string",position)
    list.string.push(item)
}

//添加事物类型的输入提示项
export function addExitenceInputSuggestion(type:Type,exitence:Exitence){
    //目标列表
    const list = getTargetList("exitence","project")
    //事物类型的跳转对象是其type和exitence的key组成的数组
    const item:ExitenceItem = {
        text:exitence.name, 
        info:"创建的事物",
        target:type.__key
    }

    //如果该事物具备别名，还会同时创建别名的输入提示
    const setting:any = {...type.setting,...exitence?.setting}
    if(setting["nickName"] != null){
        const status = getExitenceStatusByKey(setting.nickName,exitence.status,type.typeStatus)
        if(status){
            //添加别名
            item["nickName"] = status.value
        }
    }
    //添加这样一个item
    list.exitence[exitence.__key] = item
}

//改变事物的部分输入提示
export function changeExitenceInputSuggestion(exitenceKey:string,type:"name"|"nickName",value:any){
    const list = getTargetList("exitence")
    if(!list.exitence[exitenceKey])return false

    //防呆
    if(typeof value != "string"){
        value = translateToTextContent(value)
    }
    //改变事物的名称
    if(type == "name"){
        list.exitence[exitenceKey].text = value
    }
    //改变事物的别名
    else if(type == "nickName"){
        list.exitence[exitenceKey]["nickName"] = value
    }
}

//删除事物的输入提示
export function deleteExitenceInputSuggestion(exitenceKey:string){
    const list = getTargetList("exitence")
    if(!list.exitence[exitenceKey])return false
    delete list.exitence[exitenceKey]
}

/**
 * 在指定位置显示输入提示,并保存当前光标位置
 * @param input 当前已经输入的内容
 * @param suggestionContent 在提示器内显示的输入提示对象
 * @param oldRange 显示提示器时的光标位置
 * @param onInputSuggestion 提示器内容触发时的事件
 * @param position 提示器的显示位置 
 */
export function showInputSuggester({input,suggestionContent,onInputSuggestion,position}:{
    input:string,
    suggestionContent:any[],
    onInputSuggestion?:()=>void,
    position?:{left:number,top:number}
}){
    //显示提示器
    ifShow.value = true;
    //记录变量
    content.value = suggestionContent
    //已经输入的内容
    inputText.value = input 
    
    if(onInputSuggestion){
        inputSuggestionEvent.value = onInputSuggestion
    }
    if(position){positionCSS.value = position}
    else{
        //记录当前光标的left和top
        const tmp = getInputPosition()
        if(tmp){positionCSS.value = tmp}
    }
}

// 隐藏输入提示 
export function hideInputSuggestion(){
    ifShow.value = false
}

// 判断是否需要输入提示，若为是则返回提示对象列表
export function checkInputSuggestion(
    inputSuggestionList:InputSuggestionList|"all"|"global"|"project",
    input:string
):SuggestionItem[]|false{
    if(input == ""){
        return false
    }
    if(isString(inputSuggestionList)){
        inputSuggestionList = getInputSuggestionList(inputSuggestionList)
    }   
    const arr:SuggestionItem[] = [] //存储所有的输入提示
    //先判断事物类型的item
    const exitenceList = inputSuggestionList.exitence
    for(let key in exitenceList){
        //先判断是否符合事物本身的text
        const item = exitenceList[key]
        if(item.text.startsWith(input)){
            arr.push({
                ...item,
                type:"exitence",
                target:[item.target,key]//分类的Key,事物的key
            })
        }
        //再判断是否在手动别名中
        const manual = item?.manual
        if(manual){
        for(let i of manual){
            if(i.text.startsWith(input)){
                arr.push({
                    target:[item.target,key],
                    text:i.text,//显示的是手动别名的内容
                    type:"exitence",
                    info:i.info??`${item.text}的别名`
                })
            }
        }}

        //再判断其是否在别名中
        const nickName = item?.nickName
        if(nickName){
        for(let i of nickName){
            if(i.startsWith(input)){
                arr.push({
                    text:i,//显示的是别名的内容
                    target:[item.target,key],
                    type:"exitence",
                    info:`${item.text}的别名`,
                    attr:"nickName" //标识别名
                })
            }
        }}
    }
    //再判断字符串类型的item
    for(let item of inputSuggestionList.string){
        if(item.text.startsWith(input)){
            arr.push({
                ...item,
                type:"string",
                attr:item.attr
            })
        }
    }
    if(arr.length > 0){
        return arr
    }
    return false
}

// 补全功能: 在当前光标后补全text的内容
export function autoComplete(input:string,text:string){
    //需要补充的内容
    const completeText = text.slice(input.length)
    //向当前光标后添加这些内容
    addInputLast(completeText)
}

// 补全功能：补全一个dom对象
export function autoCompleteDom(input:string,domHTML:string){
    //先删除input内容
    deleteInputLast(input.length)
    //再添加dom对象
    addInputLastDiv(domHTML)
}

// 补全：补全一个跳转div
function autoCompleteJumpDiv(input:string,data:any){
    //获取跳转div的html
    const domHTML = jumpDivHtml(data)
    if(!domHTML){
        return false
    }
    //先删除input内容
    deleteInputLast(input.length)
    //再添加dom对象
    addInputLastDiv(domHTML,null,data)
}
