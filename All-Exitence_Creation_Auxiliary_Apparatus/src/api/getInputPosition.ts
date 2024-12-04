//获取当前屏幕上的光标底部的视口位置
export function getInputPosition(){
    const selection = window.getSelection();
    if (selection?.rangeCount){
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        return {top:rect.top+rect.height,left:rect.left}
    }
    else{
        return false
    }
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

//向当前屏幕上的光标后添加一段内容
export function addInputLast(text:string){
    const selection = window.getSelection();  // 获取当前的文本选区
    console.log(selection)
    if(!selection){
        return false
    }
    // 获取选区的第一个 Range 对象
    const range = selection.getRangeAt(0);  
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
}