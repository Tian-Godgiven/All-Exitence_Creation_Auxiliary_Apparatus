// 从element元素中递归查找符合条件的 div.target 元素
export function findTargetDivs(element:any,result:any[],targetClass:string,getRule:(e:any)=>{}) {
    Array.from(element.childNodes).forEach((child:any) => {
        // 判断当前元素是否符合条件，若符合则将其值添加到数组中
        //文本节点
        if(child.nodeType == 3){
            if(child.textContent.trim()){
                result.push(child.textContent)
            }
        }
        //是div
        else if(child.tagName === 'DIV'){
            //如果是满足条件的div
            if(child.classList && child.classList.contains(targetClass)){
                result.push(getRule(child))
            }
            //否则遍历其子元素
            else{
                result.push('\n');
                findTargetDivs(child,result,targetClass,getRule);  // 递归调用，查找子元素
            }
        }
        // 如果是 <br> 标签，表示换行
        else if(child.tagName === 'BR'){
            result.push('\n');
        }
        // 否则返回该元素的text内容
        else{
            result.push(child.textContent)
        }
    });
    return result
}