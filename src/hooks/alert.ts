import { showPopUp } from "./pages/popUp"
import { RepositoryFileError } from "@/repository/fileSystem"
import { FormatError } from "@/repository/format"
 
export interface AlertItem{
    title?:string,
    info:string,
    confirm:null | ((...args:any[])=>any),
    quit?:(()=>any)|null,//取消时触发的事件，取消按钮默认存在，除非设置为Null
    buttons?:{
        name:string,
        click:()=>any
    }[]
}
//显示一个消息提示弹窗,其仅会在按键后关闭
export function showAlert(item:AlertItem){
    showPopUp({
        size:{
            height:"auto"
        },
        name:item.title,
        vueName:"showAlert",
        mask:false,
        buttons:[],
        props:{
            item
        }
    })
}

export function showOperationError(operation: string, error: unknown): void {
    const detail = formatOperationError(operation, error)
    showAlert({
        title: "操作失败",
        info: `${operation}失败。\n\n${detail}`,
        confirm: null,
        quit: null,
        buttons: [
            {
                name: "复制详情",
                click: () => {
                    if(!navigator.clipboard){
                        showAlert({info:"无法访问剪贴板，请截图错误详情。",confirm:()=>{},quit:null})
                        return
                    }
                    void navigator.clipboard.writeText(detail).catch(()=>{
                        showAlert({info:"复制失败，请截图错误详情。",confirm:()=>{},quit:null})
                    })
                }
            },
            { name: "关闭", click: () => {} }
        ]
    })
}

function formatOperationError(operation: string, error: unknown): string {
    const lines = [`操作：${operation}`]
    if(error instanceof RepositoryFileError){
        lines.push(`错误类型：${error.code}`)
        lines.push(`路径：${error.path}`)
        lines.push(`详情：${toErrorText(error.originalError)}`)
    }
    else if(error instanceof FormatError){
        lines.push("错误类型：数据格式")
        lines.push(`路径：${error.path}`)
        lines.push(`详情：${error.message}`)
    }
    else{
        lines.push(`详情：${toErrorText(error)}`)
    }
    return lines.join("\n")
}

function toErrorText(error: unknown): string {
    if(error instanceof Error) return `${error.name}: ${error.message}`
    if(typeof error === "string") return error
    try{return JSON.stringify(error) ?? String(error)}catch{return String(error)}
}
