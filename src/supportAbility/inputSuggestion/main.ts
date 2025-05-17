import { shallowReactive, toRaw } from "vue"
import { tryReadFileAtPath, writeFileAtPath } from "../../hooks/fileSysytem"
import { SupportAbilitySignUpItem } from "@/static/list/supportAbilityList"
import { cloneDeep } from "lodash"

//注册该插件
export const inputSuggestionSighUpItem:SupportAbilitySignUpItem = {
    name:"inputSuggestion",
    init:()=>initInputSuggestion(),
    save:(projectName:string|null)=>saveInputSuggestion(projectName),
    syncProject:(projectName:string)=>syncInputSuggestion(projectName),
    call:()=>showInputSuggestionManager()
}

//默认列表样式
const defaultList = {
    string:[],
    exitence:{}
}
//当前的全局输入提示表
export const globalInputSuggestionList = shallowReactive(cloneDeep(defaultList))
//当前的项目中的输入提示表
export const projectInputSuggestionList = shallowReactive(cloneDeep(defaultList))

//初始化输入建议文件
async function initInputSuggestion(){
    //初始化全局输入建议文件
    const dataPath = "appData"
    const list = defaultList
    const inputSuggestionList = await tryReadFileAtPath(dataPath,"globalInputSuggestionList.json",true,list)
    Object.assign(globalInputSuggestionList,inputSuggestionList)
}

//同步项目：尝试读取项目输入建议文件，若无则创建
async function syncInputSuggestion(projectPath:string){
    const dataPath = projectPath+"/data"
    const list = defaultList
    const inputSuggestionList = await tryReadFileAtPath(dataPath,"inputSuggestionList.json",true,list)
    Object.assign(projectInputSuggestionList,inputSuggestionList)
}

//保存输入建议文件
async function saveInputSuggestion(projectPath:string|null){
    //将当前全局输入建议保存到文件中
    const list = toRaw(globalInputSuggestionList)
    await writeFileAtPath("appData","globalInputSuggestionList.json",list)
    //保存当前项目的输入建议
    if(projectPath){
        const dataPath = projectPath+"/data"
        const list = toRaw(projectInputSuggestionList)
        await writeFileAtPath(dataPath,"inputSuggestionList.json",list)
    }
}

//显示输入建议管理弹窗
function showInputSuggestionManager(){

}