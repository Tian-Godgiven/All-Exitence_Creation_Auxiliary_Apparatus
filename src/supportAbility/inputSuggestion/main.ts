import { shallowReactive, toRaw } from "vue"
import { tryReadFileAtPath, writeFileAtPath } from "../../hooks/fileSysytem"
import type { SupportAbilitySignUpItem } from "@/static/list/supportAbilityList"
import { cloneDeep } from "lodash"
import type { ProjectFeature } from "@/repository/projectFeature"
import { tauriFeatureRepository } from "@/repository/tauriFeatureRepository"
import { showOperationError } from "@/hooks/alert"

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
export type InputSuggestionData = {
    string: unknown[],
    exitence: Record<string, unknown>
}
//当前的全局输入提示表
export const globalInputSuggestionList = shallowReactive(cloneDeep(defaultList))
//当前的项目中的输入提示表
export const projectInputSuggestionList = shallowReactive(cloneDeep(defaultList))
let globalInputSuggestionAvailable = false

export const inputSuggestionProjectFeature:ProjectFeature<InputSuggestionData> = {
    key:"input-suggestion",
    createDefault:()=>cloneDeep(defaultList),
    load:(data)=>{
        Object.keys(projectInputSuggestionList).forEach((key)=>{
            delete projectInputSuggestionList[key as keyof typeof projectInputSuggestionList]
        })
        Object.assign(projectInputSuggestionList,cloneDeep(data))
    },
    snapshot:()=>cloneDeep(toRaw(projectInputSuggestionList))
}

//初始化输入建议文件
async function initInputSuggestion(){
    try{
        const data = await tauriFeatureRepository.loadGlobal<InputSuggestionData>("input-suggestion")
        if(data === null){
            await tauriFeatureRepository.saveGlobal("input-suggestion",cloneDeep(defaultList))
        }
        else{
            Object.assign(globalInputSuggestionList,data)
        }
        globalInputSuggestionAvailable = true
    }
    catch(error){
        showOperationError("读取全局输入建议",error)
    }
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
    if(globalInputSuggestionAvailable){
        try{
            await tauriFeatureRepository.saveGlobal("input-suggestion",toRaw(globalInputSuggestionList))
        }
        catch(error){showOperationError("保存全局输入建议",error)}
    }
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
