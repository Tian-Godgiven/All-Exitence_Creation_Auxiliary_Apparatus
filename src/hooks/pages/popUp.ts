import { reactive, ref, ShallowRef } from "vue"
import { disableChangePage, enableChangePage } from "./pageChange"
import { Icon } from "@/static/list/iconList"
import { nanoid } from "nanoid"

export let popUpList = reactive<PopUp[]>([])
export let maskIndex = ref(0)

//弹窗的所有可选设置
export type PopUpSet = {
	name?:string, //弹窗的标题名称,默认为无
	buttons?:Button[]|null, //弹窗右上角显示的按钮
	props?:{}, //弹窗的组件中需要使用的数据
	mask?:boolean, //是否显示遮罩层，默认为false
	repeatable?:boolean,//是否允许重复同样的弹窗，默认为否
	//尺寸，注意仅接受字符串，需要带单位
	size?:{
		width?:string,
		height?:string,
	},
	//位置
	position?:{
		x?:string,
		y?:string
	}
}
export type PopUp = PopUpSet &{
	id?:string,//弹窗的唯一性id
	vueName?:string, //弹窗对应的vue对象名称
	vue?:ShallowRef<any>, //弹窗中显示的vue组件
	returnValue?:(...args: any[])=> void, //用于在弹窗中使用的返回回调事件
	onClose?:(...args: any[])=> void, //用于在关闭弹窗中使用的回调事件，通常为reject
	index?:number, //弹窗的位置，一般来说不需要设置,
}
interface Button{
	name:string,
	click:()=>void,
	icon?:Icon
}

// 显示弹窗
export function showPopUp(popUp:PopUp){
	//默认不会显示重复的弹窗，除非popUp中明确要求可重复
	if(popUp.repeatable !== true && popUp.vueName != "showAlert"){
		const ifShowing = popUpList.some(thePopUp=>{
			//vue对象相同的情况下
			if((popUp.vue && popUp.vue.value == thePopUp.vue) || 
				popUp.vueName && popUp.vueName == thePopUp.vueName
			){
				return true
			}
		})
		if(ifShowing)return;
	}
	


	// 阻止页面滑动切换
	disableChangePage()
	// 默认名称为null
	if(!popUp.name){
		popUp["name"] = ""
	}
	// 默认具备关闭按键
	if(popUp.buttons){
		popUp.buttons.push({
			name:"关闭",
			click:()=>{
				closePopUp()
			},
			icon:"closePopUp"
		})
	}
	
	//弹窗显示mask
	if(popUp.mask){
		showMask(popUp)
		maskIndex.value += 1
	}

	popUp.id = nanoid()
	
	// 添加弹窗
	popUp["index"] = popUpList.length
	popUpList.push(popUp)
}

// 关闭弹窗
export function closePopUp(popUp?:PopUp){
	// 未指定弹窗时，关闭最外层弹窗
	if(!popUp){
		popUp = popUpList.pop()
	}
	// 删除指定弹窗
	else{
		//找到指定的popUp的index
		const index = popUpList.indexOf(popUp)
		if(index != -1){
			popUpList.splice(index,1)
		}
	}

	//执行关闭函数
	if(popUp?.onClose){
		popUp?.onClose()
	}
	
	//如果指定了弹窗并且该弹窗显示了mask
	if(popUp && popUp.mask){
		//从maskPopUp中删除
		const index = maskPopUp.indexOf(popUp)
		maskPopUp.splice(index,1)
		maskIndex.value -= 1
	}

	//已经没有任何弹窗时
	if(maskIndex.value == 0){
		hideMask()
		// 恢复页面切换
		enableChangePage()
	}
}

// 弹窗的遮罩层
export let ifMask = ref(false)
export let maskAlpha = 0.3
export const maskPopUp:PopUp[] = [] //mask对应的popUp堆栈，每次点击mask都会关闭最外层的popUp

function showMask(popUp:PopUp){
	ifMask.value = true
	maskPopUp.push(popUp)
}
function hideMask(){
	ifMask.value = false
}
//关闭最外层的弹窗
export function clickMask(){
	const tmp = maskPopUp.pop()
	closePopUp(tmp)
}
