import { showPopUp } from "./pages/popUp"
 
export interface AlertItem{
    title?:string,
    info:string,
    confirm:null | ((...args:any[])=>any),
    quit?:()=>any,
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