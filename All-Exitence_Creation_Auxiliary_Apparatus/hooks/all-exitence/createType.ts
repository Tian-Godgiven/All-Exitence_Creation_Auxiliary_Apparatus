import { showPopUp } from "../popUp";

// 创建分类
export function createType(){
	// 显示创建分类页面
	showPopUp({
		name:"创建分类",
		buttons:[],
		vueName:"createType",
		mask:true
	})
}