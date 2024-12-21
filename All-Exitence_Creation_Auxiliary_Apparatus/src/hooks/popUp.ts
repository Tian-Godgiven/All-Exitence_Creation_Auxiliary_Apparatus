import { reactive, ref } from "vue"
import { hideMask, showMask } from "./mask"
import { disableChangePage, enableChangePage } from "./pageChange"

export let popUpList = reactive<PopUp[]>([])
export let maskIndex = ref(0)

export interface PopUp{
	name?:string, //弹窗的标题名称,默认为无
	buttons:Button[], //弹窗中，需要在右上角显示的按钮以及这些按钮的点击事件
	props?:{}, //弹窗的组件中需要使用的数据
	vueName?:string, //弹窗对应的vue对象名称
	vue?:any, //弹窗中显示的vue组件
	mask:boolean, //是否显示遮罩层
	returnValue?:(...args: any[])=> any, //用于在弹窗中使用的返回回调事件
	index?:number, //弹窗的位置，一般来说不需要设置,
	size?:{
		width?:string,
		height?:string,
	}
}
interface Button{
	name:string,
	click:()=>void,
	icon?:string
}

// 显示弹窗
export function showPopUp(popUp:PopUp){
	// 阻止页面滑动切换
	disableChangePage()
	// 默认名称为null
	if(!popUp.name){
		popUp["name"] = ""
	}
	// 默认具备关闭按键
	if(popUp.buttons.length == 0){
		popUp.buttons.push({
			name:"关闭",
			click:()=>{
				closePopUp()
			}
		})
	}
	
	//弹窗显示mask
	if(popUp.mask){
		showMask(()=>{
			closePopUp(popUp)
		})
		maskIndex.value += 1
	}
	
	// 添加弹窗
	let index = popUpList.length
	popUp["index"] = index
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
		const index = popUp.index
		if(index != null){
			popUpList.splice(index,1)
		}
	}
	
	if(popUp && popUp.mask){
		maskIndex.value -= 1
	}

	//已经没有任何弹窗时
	if(maskIndex.value == 0){
		hideMask()
		// 恢复页面切换
		enableChangePage()
	}
}