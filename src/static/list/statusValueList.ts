
import chooseValueVue from "@/components/all-exitence/status/valueType/choose/chooseValue.vue"
import DateValue from "@/components/all-exitence/status/valueType/date/dateValue.vue"
import inputValueVue from "@/components/all-exitence/status/valueType/input/inputValue.vue"
import inputBoxValueVue from "@/components/all-exitence/status/valueType/inputBox/inputBoxValue.vue"
import multiValueVue from "@/components/all-exitence/status/valueType/multi/multiValue.vue"
import radioValueVue from "@/components/all-exitence/status/valueType/radio/radioValue.vue"
import rangeValueVue from "@/components/all-exitence/status/valueType/range/rangeValue.vue"
import relationValueVue from "@/components/all-exitence/status/valueType/relation/relationValue.vue"
import selectValueVue from "@/components/all-exitence/status/valueType/select/selectValue.vue"
import switchValueVue from "@/components/all-exitence/status/valueType/switch/switchValue.vue"
import tagsValueVue from "@/components/all-exitence/status/valueType/tags/tagsValue.vue"
import ChooseExitenceValue from "@/components/all-exitence/status/valueType/chooseExitence/ChooseExitenceValue.vue"

// 属性值类型表
export let statusValueTypeList = [
	{value : "input",label : "输入"},
	{value : "inputBox",label : "输入框"},
	{value : "range",label : "范围选择"},
	{value : "choose",label : "选择选项"},
	{value : "select",label : "选项框"},
	{value : "chooseExitence", label : "选择事物"},
	{value : "switch",label : "滑动开关"},
	{value : "radio",label : "灯开关"},
	{value : "tags",label: "标签"},
	{value : "date",label : "日期"},
	{value : "relation",label:"关联属性"},
	{value : "multi",label : "复合属性"},
	{value : "status",label: "嵌套属性"},
]

// 属性值类型对应组件表
export let statusValueVueList:{[key:string]:any} = {
	"input":inputValueVue,
	"inputBox":inputBoxValueVue,
	"range":rangeValueVue,
	"choose":chooseValueVue,
	"switch":switchValueVue,
	"select":selectValueVue,
	"radio":radioValueVue,
	"multi":multiValueVue,
	"tags":tagsValueVue,
	"relation":relationValueVue,
	"date":DateValue,
	"chooseExitence":ChooseExitenceValue,
}