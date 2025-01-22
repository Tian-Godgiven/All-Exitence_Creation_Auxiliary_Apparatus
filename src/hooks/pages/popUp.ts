import { reactive, ref } from "vue"
import { hideMask, showMask } from "./masks/popUpMask"
import { disableChangePage, enableChangePage } from "./pageChange"
import { ButtonIcon } from "@/data/list/buttonIconList"

export let popUpList = reactive<PopUp[]>([])
export let maskIndex = ref(0)

export interface PopUp{
	name?:string, //弹窗的标题名称,默认为无
	buttons:Button[]|null, //弹窗中，需要在右上角显示的按钮
	props?:{}, //弹窗的组件中需要使用的数据
	vueName?:string, //弹窗对应的vue对象名称
	vue?:any, //弹窗中显示的vue组件
	mask:boolean, //是否显示遮罩层
	returnValue?:(...args: any[])=> any, //用于在弹窗中使用的返回回调事件
	index?:number, //弹窗的位置，一般来说不需要设置,
	size?:{
		width?:string,
		height?:string,
	},
	position?:{
		x?:string,
		y?:string
	}
}
interface Button{
	name:string,
	click:()=>void,
	icon?:ButtonIcon
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
	if(popUp.buttons && popUp.buttons.length == 0){
		popUp.buttons.push({
			name:"关闭",
			click:()=>{
				closePopUp()
			},
			icon:"close"
		})
	}
	
	//弹窗显示mask
	if(popUp.mask){
		showMask(popUp)
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
		//找到指定的popUp的index
		const index = popUpList.indexOf(popUp)
		if(index != -1){
			popUpList.splice(index,1)
		}
	}
	
	//如果指定了弹窗并且该弹窗显示了mask
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

//点击到当前聚焦弹窗之外时，关闭该弹窗
