import { JumpData } from "@/supportAbility/inputSuggestion/suggester/jumpDiv";

//获取当前屏幕上的光标底部的视口位置
export function getInputPosition(){
    const selection = window.getSelection();
    if (selection?.rangeCount){
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        return {top:rect.bottom,left:rect.left}
    }
    else{
        return false
    }
}

//将光标移动到指定的range的末尾
export function moveCursorTo(range:Range){
    const selection = window.getSelection();
    if(!selection) return false
    if(!range) return false
    // 取消当前选择的文本范围
    selection.removeAllRanges();
    // 创建一个新的 Range 对象，并设置其起始和结束位置
    selection.addRange(range);
    // 让光标移动到 range 的末尾
    selection.collapseToEnd();
    return selection.getRangeAt(0)
}

//获取当前屏幕上的光标的前一个字符
export function getInputLast(){
    const selection = window.getSelection();
    if(selection){
        const range = selection.getRangeAt(0);  // 获取当前光标的范围
        // 获取光标所在位置的文本节点
        const startContainer = range.startContainer;
        
        // 判断是否为文本节点，并且光标前面有字符
        if (startContainer.textContent && startContainer.nodeType === 3 && range.startOffset > 0) {
            return startContainer.textContent.charAt(range.startOffset - 1);  // 获取光标前一个字符
        }
        return false;// 如果光标在开头，返回false
    }
    
    return false;  
}

//向当前屏幕上的光标后添加一段文本内容
export function addInputLast(text:string,range?:Range){
    const selection = window.getSelection();  // 获取当前的文本选区
    if (!selection) return false;

    // 如果没有传入range，则获取当前选区中的range
    if(!range){
        range = selection.getRangeAt(0);
    }

    // 创建一个新的文本节点
    const textNode = document.createTextNode(text);
    // 插入文本节点到选区的位置
    range.deleteContents();  // 删除当前选区中的内容（如果有的话）
    range.insertNode(textNode);  // 插入文本

    // 调整光标位置：将光标放在插入的文本后面
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();  // 清除当前选区
    selection.addRange(range);  // 重新设置选区，光标位于文本后面

    //返回新的selectionRange
    return range
}

//向当前屏幕上的光标后添加一个dom,并存储可能存在的跳转目标数据
export const divWeakMap:WeakMap<HTMLElement,JumpData> = new WeakMap
export function addInputLastDiv(htmlText:string,range?:Range|null,data?:JumpData){
    // 创建一个临时的 DOM 元素并插入 HTML
    let div:any = document.createElement('div');
    div.innerHTML = htmlText; // 将 HTML 转换为 DOM 节点
    div = div.firstChild
    if(!div) return;
    
    if(data){
        // 为div绑定Weakmap数据
        divWeakMap.set(div, data);
    }

    const selection = window.getSelection();
    if (!selection) return;

    // 如果没有传入range，则获取当前选区中的range
    if(!range){
        range = selection.getRangeAt(0);
    }
    
    // 插入div到选区位置
    range.deleteContents(); // 删除选区内的内容（如果有）
    range.insertNode(div); // 插入新创建的div元素

    // 调整光标位置到div后面
    const newRange = document.createRange();
    newRange.setStartAfter(div);
    newRange.setEndAfter(div);
    selection.removeAllRanges();
    selection.addRange(newRange);

    //返回新的selectionRange
    return selection.getRangeAt(0)
}

//删除屏幕上光标前的一段内容
export function deleteInputLast(length:number,range?:any){
    // 获取当前的文本选区
    const selection = window.getSelection();  
    if (!selection) return;
     // 如果没有传入range，则获取当前选区中的range
    if(!range){
        range = selection.getRangeAt(0);
    }
    // 克隆当前 Range 对象来处理删除操作
    const cloneRange = range.cloneRange();
    // 将 Range 的起始点移动到光标前的一段内容
    cloneRange.setStart(range.startContainer, Math.max(range.startOffset - length, 0)); // 例如删除光标前20个字符
    
    // 删除光标前的内容
    cloneRange.deleteContents();
    
    // 重新选择剩下的部分
    selection.removeAllRanges();
    selection.addRange(range);
}