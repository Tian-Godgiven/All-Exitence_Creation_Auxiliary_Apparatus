import { ref } from "vue"
export let ifMask = ref(false)
export let maskAlpha = ref(0.3)
export const maskAlphaMax = 0.3
let clickMaskFunction = ()=>{}

export function showMask(click?:()=>void){
	ifMask.value = true
	if(click){
		clickMaskFunction = click
	}
}
export function hideMask(){
	ifMask.value = false
}
export function changeMaskAlpha(newAlpha:number){
	newAlpha.toFixed(2)
	maskAlpha.value = newAlpha
}
export function clickMask(){
	clickMaskFunction()
}