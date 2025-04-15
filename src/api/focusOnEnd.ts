// 传入一个dom对象，将光标移至其最后的位置，常用于重新聚焦contenteditable元素
export function focusOnEnd(dom:Element|null){
    if (dom) {
        if(dom instanceof HTMLElement){
            dom.focus()
        }
        const range = document.createRange();
        const selection = window.getSelection();
        if(!selection){
            return false
        }
        range.selectNodeContents(dom); // 选择内容区域
        range.collapse(false); // 把光标放到最后
        selection.removeAllRanges();
        selection.addRange(range); // 更新光标
    }
}