import { showPopUp } from "./pages/popUp"

interface AlertItem{
    title?:string,
    info:string,
    confirm:(...args:any[])=>any,
    quit?:()=>any,
    buttons?:{
        buttonName:string,
        func:()=>any
    }[]
}
//显示一个消息提示弹窗
export function showAlert(item:AlertItem){
    const {title,info,confirm,quit,buttons} = item
    showPopUp({
        size:{
            height:"auto"
        },
        name:title,
        vueName:"showAlert",
        mask:false,
        buttons:[],
        props:{
            info,
            confirm,
            quit,
            buttons
        }
    })
}