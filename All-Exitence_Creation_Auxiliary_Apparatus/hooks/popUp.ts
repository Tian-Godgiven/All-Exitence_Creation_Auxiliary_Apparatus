import { reactive, ref } from "vue"
import { changeMaskAlpha, hideMask, showMask } from "./mask"

export let popUpList = reactive([])
let maskIndex = 0

export interface PopUp{
	name:string,
	buttons:Button[],
	vueName:string,
	mask:boolean,
	index?:number,
}

interface Button{
	name:string,
	click:()=>void,
	icon?:string
}

// 显示弹窗
export function showPopUp(popUp:PopUp){
	showMask(()=>{
		closePopUp(popUp)
	})
	let index = popUpList.length
	popUp["index"] = index
	popUpList.push(popUp)
	//弹窗显示mask
	if(popUp.mask){
		showMask()
		maskIndex += 1
	}
}

// 关闭弹窗
export function closePopUp(popUp?:PopUp){
	// 未指定弹窗时，关闭最外层弹窗
	if(!popUp){
		popUp = popUpList.pop()
	}
	else{
		const index = popUp.index
		popUpList.splice(index,1)
	}
	
	if(popUp.mask){
		maskIndex -= 1
		if(maskIndex == 0){
			hideMask()
		}
	}
}