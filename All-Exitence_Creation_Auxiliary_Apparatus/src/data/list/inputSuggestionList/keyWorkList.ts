import { autoComplete, autoCompleteDom } from "@/hooks/inputSuggestion"
import { suggestionItem } from "@/hooks/inputSuggestion"

export function addKeyWord(item:suggestionItem){
    if(!item.click){
        //文本内容自动补全
        if(item.type == "string"){
            item.click = (input,item)=>{
                autoComplete(input,item.text)
            }
        }
        //事物对象删除输入内容，并填入div
        if(item.type == "exitence"){
            item.click = (input,item)=>{
                autoCompleteDom(input,"123")
            }
        }
    }
}

export const keyWordList:suggestionItem[] = [
    {
        text:"123456789",
        info:"这是测试这是测试这是测试这是测试这是测试这是测试这是测试",
        type:"string",
        click:(input,item)=>{
            autoComplete(input,item.text)
        }
    }
]