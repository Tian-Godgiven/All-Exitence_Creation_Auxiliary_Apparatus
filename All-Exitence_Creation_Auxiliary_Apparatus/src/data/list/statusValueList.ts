import Status from "@/interfaces/exitenceStatus"
import chooseValueVue from "@/components/popUps/all-exitence/status/statusValue/chooseValue.vue"
import downLineValueVue from "@/components/popUps/all-exitence/status/statusValue/downLineValue.vue"
import inputBoxValueVue from "@/components/popUps/all-exitence/status/statusValue/inputBoxValue.vue"
import multiValueVue from "@/components/popUps/all-exitence/status/statusValue/multiValue.vue"
import radioValueVue from "@/components/popUps/all-exitence/status/statusValue/radioValue.vue"
import rangeValueVue from "@/components/popUps/all-exitence/status/statusValue/rangeValue.vue"
import selectValueVue from "@/components/popUps/all-exitence/status/statusValue/selectValue.vue"
import switchValueVue from "@/components/popUps/all-exitence/status/statusValue/switchValue.vue"

// 属性值类型表
export let statusValueTypeList = [
	{value : "downLine",text : "输入线"},
	{value : "inputBox",text : "输入框"},
	{value : "range",text : "范围选择"},
	{value : "choose",text : "选项选择"},
	{value : "select",text : "选项框"},
	{value : "switch",text : "滑动开关"},
	{value : "radio",text : "灯开关"},
	{value : "date",text : "日期"},
	{value : "multi",text : "复合属性"},
	{value : "status",text: "嵌套属性",}
]

// 属性值类型对应组件表
export let statusValueVueList:{[key:string]:any} = {
	"downLine":downLineValueVue,
	"inputBox":inputBoxValueVue,
	"range":rangeValueVue,
	"choose":chooseValueVue,
	"switch":switchValueVue,
	"select":selectValueVue,
	"radio":radioValueVue,
	"multi":multiValueVue
}

// 属性设置项表
export let statusSettingList:{
	name:string,
	value:any,
	text:string,
	default?:any,
	type:string,
	inputs?:any,
	select?:(status:Status)=>boolean,
	confrimValue?:(status:Status)=>boolean

}[] = [
	{name:"hoverBox",value:"false",text:"修改时显示输入框",default:true,type:"turnOn"},
	{name:"exitenceBox",value:["[","]"],text:"事物",type:"input",inputs:["左侧","右侧"]},
]