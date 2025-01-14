//用于将

import { divWeakMap } from "@/api/cursorAbility";
import { jumpDivHtml } from "../inputSupport/inputSuggestion/jumpDiv";

//将前端的显示内容转换为文件内容
export function translateToFileContent(frontEndNodes:NodeList){
    const fileContent:any[] = []
    //遍历前端内容
    try{
        frontEndNodes.forEach((node:any) => {
            //jumpDiv类型
            if(node.classList && node.classList.contains("jumpDiv")){
                //获取div的数据
                const data = divWeakMap.get(node)
                //额外存储node的文本内容为text
                data.text = node.innerText
                fileContent.push(data)
            }
            //文本类型
            else{
                //如果是br，则添加一个\n符
                if(node.nodeName == "BR"){
                    fileContent.push("\n")
                }
                else{
                    const inner = node?.data || node?.innerText
                    //如果是换行的div，要额外添加一个换行
                    if(node.nodeName == "DIV" && inner != "\n"){
                        fileContent.push("\n")
                    }
                    if(inner && inner != ""){
                        fileContent.push(inner)
                    }
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

//将文件内容翻译为前端内容数组
export function translateToFrontEndContent(fileContent:any[]|string){
    //如果文件里只保存了一个字符串，则直接返回它
    if(typeof fileContent == "string"){
        const textNode = document.createTextNode(fileContent)
        return [textNode]
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

//将文件内容翻译为文本内容(txt)
export function translateToTextContent(fileContent:any[],short:boolean=false){
    let textContent = ""
    if(typeof fileContent == "string"){
        return fileContent
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
            //跳转对象
            else{
                //只要Inner
                textContent += part.text
            }
        })
    }
    catch(err){
        console.error(err)
    }

    //只有一个换行的情况
    if(textContent == "\n"){
        return ""
    }

    return textContent
}