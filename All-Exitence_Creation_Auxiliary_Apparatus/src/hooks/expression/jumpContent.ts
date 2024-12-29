//用于将

import { divWeakMap } from "@/api/cursorAbility";
import { jumpDivHtml } from "../inputSupport/inputSuggestion/jumpDiv";

//将前端的显示内容转换为文件内容
export function translateToFileContent(frontEndNodes:NodeList){
    const fileContent:any[] = []
    //遍历前端内容
    frontEndNodes.forEach((node:any) => {
        //文本类型
        if(node.nodeType == 3){
            fileContent.push(node.data)
        }
        //jumpDiv类型
        else if(node.classList.contains("jumpDiv")){
            const data = divWeakMap.get(node)
            const jumpContent = {
                target:data.target,
                type:data.type,
                inner:node.innerText,
            }
            console.log(jumpContent)
            fileContent.push(jumpContent)
        }
    });
    return fileContent
}

//将文件内容翻译为前端内容数组
export function translateToFrontEndContent(fileContent:any[]){
    const frontEndContent:any[] = []
    //遍历文件内容
    fileContent.forEach((part:any)=>{
        //如果是字符串
        if(typeof part == "string"){
            //作为text放入
            const textNode = document.createElement("text")
            textNode.innerHTML = part
            frontEndContent.push(textNode)
        }
        //跳转对象
        else{
            //作为跳转div放入
            const divHtml = jumpDivHtml(part.inner)
            //获取跳转div
            let div:any = document.createElement('div');
            div.innerHTML = divHtml; // 将 HTML 转换为 DOM 节点
            div = div.firstChild
            if(!div) return;
            // 为div绑定Weakmap数据
            divWeakMap.set(div, {type:part.type,target:part.target});
            // 添加这个跳转div
            frontEndContent.push(div)
        }
    })

    return frontEndContent
}