import { ref } from "vue"
export let ifMask = ref(false)
export let maskAlpha = ref(0.6)
export const maskAlphaMax = 0.6

export function showMask(){
	ifMask.value = true
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
}