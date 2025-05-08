import Status from "@/interfaces/Status"

import { SettingOption } from "@/components/all-exitence/setting/setting"
import { chooseExitenceSettingList } from "./chooseExitenceStatus"

export type StatusSetting = SettingOption<Status>

const hoverBox:SettingOption<Status> = {
	name:"hoverBox",
	value:true,
	text:"修改时显示输入框",
	type:"checkBox",
}

const unit:SettingOption<Status> ={
	name:"unit",
	value:"",
	text:"单位：",
	type:"input",
}

const chooseByRadio:SettingOption<Status> ={
	name:"chooseByRadio",
	value:false,
	text:"使用灯开关表现选项",
	type:"checkBox",
}

const chooseDirection:SettingOption<Status> ={
	name:"chooseDirection",
	value:"horizontal",
	text:"选项排列方向：",
	type:"choose",
	choices:[{
		value:"horizontal",
		label:"横向"
	},{
		value:"vertical",
		label:"竖向"
	}]
}

const insteadOfName:SettingOption<Status> ={
	name:"insteadOfName",
	text:"取代属性名显示：",
	type:"input"
}

const noStatusNameInExitence:SettingOption<Status> ={
	name:"noStatusNameInExitence",
	text:"在事物中不显示该属性名",
	type:"checkBox",
	value:false
}

const relationTitle:SettingOption<Status> ={
	"name":"relationTitle",
	"text":"显示关联属性标题",
	"type":"checkBox",
	"value":true,
}

const relationAdd:SettingOption<Status> ={
	"name":"relationAdd",
	"text":"允许添加新的关联单元",
	"type":"checkBox",
	"value":true,
}

const tagsAdd:SettingOption<Status> ={
	"name":"tagsAdd",
	"text":"在末尾显示新增标签",
	"type":"checkBox",
	"value":true,
}
const inputPlaceholder:SettingOption<Status> ={
	"name":"inputPlaceholder",
	"text":"属性值为空时的显示的占位符",
	"type":"input",
	"value":"",
}
const ifGlobalInputSuggestion:SettingOption<Status> ={
	"name":"ifGlobalInputSuggestion",
	"text":"启用全局输入建议",
	"type":"checkBox",
	"value":true,
}
const ifProjectInputSuggestion:SettingOption<Status> ={
	"name":"ifProjectInputSuggestion",
	"text":"启用项目输入建议",
	"type":"checkBox",
	"value":true,
}

// 根据属性类型分别的设置项表
const statusSettingList:Record<string,SettingOption<Status>[]> = {
	all:[insteadOfName,noStatusNameInExitence],
	input:[unit,inputPlaceholder,ifGlobalInputSuggestion,ifProjectInputSuggestion],
	inputBox:[hoverBox,unit,inputPlaceholder,ifGlobalInputSuggestion,ifProjectInputSuggestion],
	range:[unit],
	choose:[chooseByRadio,chooseDirection],
	relation:[relationTitle,relationAdd],
	tags:[tagsAdd],
	chooseExitence:chooseExitenceSettingList
}

//根据属性类型获取某个设置内容项
export function getStatusSetting(status:Status){
	const type = status.valueType
	//注意通用的设置项放在末尾
	if(statusSettingList[type]){
		return [...statusSettingList?.[type],...statusSettingList.all]
	}
	return [...statusSettingList.all]
	
}
