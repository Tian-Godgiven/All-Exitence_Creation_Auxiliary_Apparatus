import { ref } from "vue"
import { closePopUp, PopUp } from "../popUp"
export let ifMask = ref(false)
export let maskAlpha = ref(0.3)
export const maskAlphaMax = 0.3
export const maskPopUp:PopUp[] = [] //mask对应的popUp堆栈，每次点击mask都会关闭最外层的popUp

export function showMask(popUp:PopUp){
	ifMask.value = true
	maskPopUp.push(popUp)
}
export function hideMask(){
	ifMask.value = false
}
export function changeMaskAlpha(newAlpha:number){
	newAlpha.toFixed(2)
	maskAlpha.value = newAlpha
}
//关闭最外层的弹窗
export function clickMask(){
	closePopUp(maskPopUp.pop())
}