import { ref } from "vue"

export let inputSupportShowing = ref(false)

export function showInputSupport(){
	inputSupportShowing.value = true
}
export function hideInputSupport(){
	inputSupportShowing.value = false
}