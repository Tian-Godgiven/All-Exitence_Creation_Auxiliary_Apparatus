import ControlPanel from "@/popUps/ControlPanel.vue"
import { showPopUp } from "./pages/popUp"
import { shallowRef } from "vue"

export type Control = {
    title?:string,
    option:{
        text:string,
        click:()=>any
    }[]
}

/**
 * 显示一个控制面板弹窗
 * @param control:title?:标题，option:{text:选项文本,click:点击选项事件}[]
 * @param returnValue 
 */
export function showControlPanel(control:Control,returnValue?:()=>any){
    showPopUp({
        vue:shallowRef(ControlPanel),
        mask:true,
        buttons:[],
        props:{
            control
        },
        returnValue,
        "size":{
            height:"auto"
        }
    })
}