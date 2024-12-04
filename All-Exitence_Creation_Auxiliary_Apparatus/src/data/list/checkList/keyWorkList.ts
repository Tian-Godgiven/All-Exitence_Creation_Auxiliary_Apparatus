import { addInputLast } from "@/api/getInputPosition"

export interface suggestionItem{
    text:string,
    showText?:string,
    type:string,
    info?:string,
    click?:(input:string,item:suggestionItem)=>void,
    target?:any
}

// 补全功能:在当前光标后添加内容
function autoComplete(input:string,text:string){
    //需要补充的内容
    const completeText = text.slice(input.length)
    //向当前光标后添加这些内容
    addInputLast(completeText)
}

export function addKeyWord(item:suggestionItem){
    if(!item.click){
        //文本内容自动补全
        if(item.type == "text"){
            item.click = (input,item)=>{
                autoComplete(input,item.text)
            }
        }
        //事物对象补全并连接
        if(item.type == "exitence"){
            item.click = (input,item)=>{
                autoComplete(input,item.text)
                //连接对象
            }
        }
    }
}

export const keyWordList:suggestionItem[] = [
    {
        text:"123456789",
        info:"这是测试这是测试这是测试这是测试这是测试这是测试这是测试",
        type:"text",
        click:(input,item)=>{
            autoComplete(input,item.text)
        }
    }
]