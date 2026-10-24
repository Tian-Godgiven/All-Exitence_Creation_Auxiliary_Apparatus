import ControlPanel from "@/popUps/controlPanel.vue"
import { closePopUp, PopUp, showPopUp } from "./pages/popUp"
import { shallowRef } from "vue"

export type Control = {
    title?:string,
    option:{
        text:string,
        click:()=>any
    }[]
}

export type ControlPanelPosition = {x:number,y:number}

let activeControlPanel:PopUp|undefined

/**
 * 显示一个控制面板弹窗
 * @param control:title?:标题，option:{text:选项文本,click:点击选项事件}[]
 * @param returnValue 
 */
export function showControlPanel(control:Control,position?:ControlPanelPosition,returnValue?:()=>any){
	if(activeControlPanel){
		closePopUp(activeControlPanel)
	}
	const popUp = showPopUp({
        vue:shallowRef(ControlPanel),
		className:"controlPanelPopUp",
		mask:false,
		buttons:null,
        props:{
            control
        },
        returnValue,
		"size":{
			width:"min(240px, calc(100vw - 16px))",
			height:"auto"
		},
		position:position ? {x:`${position.x}px`,y:`${position.y}px`} : undefined,
		onClose:()=>{
			if(activeControlPanel === popUp){
				activeControlPanel = undefined
			}
		}
    })
	if(popUp){
		activeControlPanel = popUp
	}
	return popUp
}
