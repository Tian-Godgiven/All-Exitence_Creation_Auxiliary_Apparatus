import { showQuickInfo } from "@/api/showQuickInfo"

//显示组件信息
export function showMultiStatusPartInfo(rect:DOMRect,info:string){
    const position = {
        top:`calc(${rect.top-4}px - 1rem)`,  // 设置 div 显示在元素上方
        left:`${rect.left + rect.width/2}`
    }
    showQuickInfo(info,{
        minWidth:"100px",
        height:"1rem",
        backgroundColor:"white",
        padding:"2px",
        border:"1px solid black",
        color:"rgb(61, 61, 61)"
    },position,true,5000)
}