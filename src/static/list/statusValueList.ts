
import chooseValueVue from "@/components/all-exitence/status/statusValue/chooseValue.vue"
import DateValue from "@/components/all-exitence/status/statusValue/dateValue.vue"
import downLineValueVue from "@/components/all-exitence/status/statusValue/downLineValue.vue"
import inputBoxValueVue from "@/components/all-exitence/status/statusValue/inputBoxValue.vue"
import multiValueVue from "@/components/all-exitence/status/statusValue/multiValue.vue"
import radioValueVue from "@/components/all-exitence/status/statusValue/radioValue.vue"
import rangeValueVue from "@/components/all-exitence/status/statusValue/rangeValue.vue"
import relationValueVue from "@/components/all-exitence/status/statusValue/relationValue.vue"
import selectValueVue from "@/components/all-exitence/status/statusValue/selectValue.vue"
import switchValueVue from "@/components/all-exitence/status/statusValue/switchValue.vue"
import tagsValueVue from "@/components/all-exitence/status/statusValue/tagsValue.vue"

// 属性值类型表
export let statusValueTypeList = [
	{value : "downLine",text : "输入线"},
	{value : "inputBox",text : "输入框"},
	{value : "range",text : "范围选择"},
	{value : "choose",text : "选项选择"},
	{value : "select",text : "选项框"},
	{value : "switch",text : "滑动开关"},
	{value : "radio",text : "灯开关"},
	{value : "tags",text: "标签"},
	{value : "date",text : "日期"},
	{value : "relation",text:"关联属性"},
	{value : "multi",text : "复合属性"},
	{value : "status",text: "嵌套属性"},
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
	"multi":multiValueVue,
	"tags":tagsValueVue,
	"relation":relationValueVue,
	"date":DateValue
}