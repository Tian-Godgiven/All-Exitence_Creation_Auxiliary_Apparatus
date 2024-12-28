import { shallowReactive, toRaw } from "vue"
import { createFileToPath, readFileFromPath, writeFileAtPath } from "../fileSysytem"

export const globalInputSuggestionList = shallowReactive([])

export async function initGlobalInputSuggestion(){
    //尝试读全局输入建议文件，失败时创建该文件
    const tmp = readFileFromPath("appData","globalInputSuggestionList.json")
    if(tmp){
        Object.assign(globalInputSuggestionList,tmp)
    }
    else{
        //失败时创建该文件
        createFileToPath("appData","globalInputSuggestionList.json",JSON.stringify([]))
    }
}

//保存全局输入建议
export async function saveGlobalInputSuggestion(){
    //将当前全局输入建议保存到文件中
    const content = toRaw(globalInputSuggestionList)
    await writeFileAtPath("appData","globalInputSuggestionList.json",content)
}