import { addInputLastDiv, deleteInputLast, getInputPosition } from "@/api/cursorAbility";
import { addInputLast } from "@/api/cursorAbility"
import { globalInputSuggestionListData } from "@/hooks/app/globalInputSuggestion";
import { projectInputSuggestionListData } from "@/hooks/project/projectData";
import { computed, ref } from "vue";
import { jumpDivHtml } from "./jumpDiv";
import { Type } from "@/class/Type";
import { Exitence } from "@/class/Exitence";
import { getExitenceStatusByKey } from "@/hooks/all-exitence/allExitence";

//输入建议单元in前端
export interface suggestionItem{
    text:string,
    type:string,
    info?:string,
    showText?:string,
    target?:any,
    attr?:any
}

//输入建议单元in文件:字符串
export interface stringItem{
    text:string,//字符串文本
    showText?:string,//显示在输入建议的标题内容
    info?:string,//显示在输入建议的解释性信息
    click?:(input:string,item:stringItem)=>void, //点击该输入提示项的事件
}
//输入建议单元in文件：事物
export interface exitenceItem{
    text:string,//事物的名称
    target:string,//事物所在的分类的key
    info?:string//说明性文本
    manual?:{text:string,info?:string}[], //手动创建的事物输入提示关键字 
    nickName?:string[] //事物的别名数组
}
//输入建议列表in文件
export interface InputSuggestionList{
    string:stringItem[],
    exitence:{ 
        [key:string]:exitenceItem
    },
}

// 输入提示div所需要显示的内容
export const content = ref<any>([])
// 是否显示输入提示
export const ifShow = ref(false)
// 输入提示的位置
export const positionCSS = ref({left:0,top:0})
//已经输入了的内容
export const inputText = ref("")
// 完成输入提示时的回调事件
export const onInputSuggestion = ref(()=>{})

// 在应用中使用的项目内的输入提示表+全局输入提示表
export const projectInputSuggestionList = computed(()=>{
    return projectInputSuggestionListData
})
export const globalInputSuggestionList = computed(()=>{
    return globalInputSuggestionListData
})
// 方便你要同时用这两个输入建议表
export const fullInputSuggestionList = computed(()=>{
    const tmp = {...globalInputSuggestionListData,...projectInputSuggestionListData}
    return tmp
})

//创建一张空的输入建议表 
export function createInputSuggestionList(){
    return {
        string:[],
        exitence:{}
    }
}

//点击一个输入提示对象
export function clickSuggestionItem(item:suggestionItem){
    const input = inputText.value
    switch(item.type){
        //字符串自动补全
        case "string":
            autoComplete(input,item.text)
            break
        //事物补全div并创建跳转div
        case "exitence":
            //跳转div的data
            const exitenceData:any = {
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


//获取目标列表
function getTargetList(type:any,position?:"global"|"project"):InputSuggestionList{
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
    const list:any = (position == "global"? globalInputSuggestionListData : projectInputSuggestionListData)
    return list
}

//向输入提示表中新增字符串类输入建议项
export function addStringSuggestion(item:stringItem,position?:"global"|"project"){
    const list = getTargetList("string",position)
    list.string.push(item)
}

//添加事物类型的输入提示项
export function addExitenceInputSuggestion(type:Type,exitence:Exitence){
    //目标列表
    const list = getTargetList("exitence","project")
    //事物类型的跳转对象是其type和exitence的key组成的数组
    const item:exitenceItem = {
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

// 在指定位置显示输入提示
export function showInputSuggestion(tmp:{
    input:string,
    suggestionContent:any[],
    onInputSuggestion?:()=>void,
    position?:any
}){
    ifShow.value = true;
    content.value = tmp.suggestionContent
    inputText.value = tmp.input //已经输入的内容
    if(tmp.onInputSuggestion){
        onInputSuggestion.value = tmp.onInputSuggestion
    }
    if(tmp.position){
        positionCSS.value = tmp.position
    }
    else{
        const tmp = getInputPosition()
        if(tmp){
            positionCSS.value = tmp
        }
    }
}

// 隐藏输入提示 
export function hideInputSuggestion(){
    ifShow.value = false
}

// 判断是否需要输入提示
export function checkInputSuggestion(inputSuggestionList:InputSuggestionList,input:string){
    if(input == ""){
        return false
    }
    const arr:suggestionItem[] = []
    //先判断事物类型的item
    const allExitence = inputSuggestionList.exitence
    for(let key in allExitence){
        //先判断是否符合事物本身的text
        const item = allExitence[key]
        if(item.text.startsWith(input)){
            arr.push({
                text:item.text,
                info:item?.info,
                target:[item.target,key],
                type:"exitence"
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
export function autoCompleteJumpDiv(input:string,data:any){
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
