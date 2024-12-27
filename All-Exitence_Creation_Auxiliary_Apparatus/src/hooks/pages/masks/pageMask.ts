import { ref } from "vue"
export let ifMask = ref(false)
export let maskAlpha = ref(0.6)
export const maskAlphaMax = 0.6

let clickEvent:()=>void

export function showMask(func:()=>void){
	ifMask.value = true
	clickEvent = func
}
export function hideMask(){
	ifMask.value = false
}
export function changeMaskAlpha(newAlpha:number){
	newAlpha.toFixed(2)
	maskAlpha.value = newAlpha
}
export function clickMask(){
	hideMask()
	clickEvent()
}