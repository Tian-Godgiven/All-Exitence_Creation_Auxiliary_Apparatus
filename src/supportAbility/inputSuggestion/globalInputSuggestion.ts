import { shallowReactive, toRaw } from "vue"
import { createFileToPath, readFileFromPath, writeFileAtPath } from "../../hooks/fileSysytem"
import { createInputSuggestionList } from "../../hooks/inputSupport/inputSuggestion/inputSuggestion"

const defaultList = createInputSuggestionList()
export const globalInputSuggestionListData = shallowReactive(defaultList)

export async function initGlobalInputSuggestion(){
    //尝试读全局输入建议文件
    const tmp = await readFileFromPath("appData","globalInputSuggestionList.json")
    if(tmp){
        Object.assign(globalInputSuggestionListData,tmp)
    }
    else{
        //失败时创建该文件
        const list = createInputSuggestionList()
        await createFileToPath("appData","globalInputSuggestionList.json",JSON.stringify(list))
        Object.assign(globalInputSuggestionListData,list)
    }
}

//保存全局输入建议
export async function saveGlobalInputSuggestion(){
    //将当前全局输入建议保存到文件中
    const content = toRaw(globalInputSuggestionListData)
    await writeFileAtPath("appData","globalInputSuggestionList.json",content)
}