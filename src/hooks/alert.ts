import { showPopUp } from "./pages/popUp"
 
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