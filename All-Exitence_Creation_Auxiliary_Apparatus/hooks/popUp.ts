import { reactive, ref } from "vue"
import { changeMaskAlpha, hideMask, showMask } from "./mask"

export let popUpList = ref([])
export let popUpIndex = ref(0)

export interface PopUp{
	name:string,
	buttons:Button[],
	inner:string,
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
	changeMaskAlpha(0.6)
	showMask(()=>{
		closePopUp(popUp)
	})
	let index = popUpList.value.length
	popUp["index"] = index
	popUpList.value.push(popUp)
	//弹窗显示mask
	if(popUp.mask){
		popUpIndex.value += 1
	}
}

// 关闭弹窗
export function closePopUp(popUp?:PopUp){
	if(!popUp){
		popUpIndex.value -= 1
		popUpList.value.pop()
	}
	else{
		if(popUp.mask){
			popUpIndex.value -= 1
		}
		const index = popUp.index
		popUpList.value.splice(index,1)
	}
	
	// 隐藏Mask
	if(popUpIndex.value == 0){
		hideMask()
	}
}