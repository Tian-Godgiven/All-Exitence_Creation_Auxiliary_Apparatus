import Status from "@/interfaces/exitenceStatus"

export interface statusSetOption{
	name:string, //设置项名称 aka 关键字
	value?:any, //设置项值，不为空时，其为默认值
	text:string, //设置项文本
	type:'checkBox' | 'input' |'choose', //设置项类型
	select?:(status:Status)=>boolean, //设置项筛选条件
	confrimValue?:(value:any)=>boolean  //设置项值确认条件
	inputs?:any, //输入性设置项的内容
	choices?:any[], //选项性设置项的选项
}

// 属性设置的内容项表
export let statusSettingList:statusSetOption[] = [
	{
		name:"hoverBox",
		value:true,
		text:"修改时显示输入框",
		type:"checkBox",
		select:(status)=>{
			if(status.valueType == "inputBox"){
				return true
			}
			return false
		}
	},
	{
		name:"exitenceBox",
		value:["[","]"],
		text:"事物",
		type:"input",
		inputs:["左侧：","右侧："],
	},
	{
		name:"unit",
		value:null,
		text:"单位：",
		type:"input",
		select:(status)=>{
			if(["downLine","inputBox","range"].includes(status.valueType)){
				return true
			}
			return false
		}
	},
	{
		name:"chooseByRadio",
		value:false,
		text:"使用灯开关表现选项",
		type:"checkBox",
		select:(status)=>{
			if(status.valueType == "choose"){
				return true
			}
			return false
		}
	},
	{
		name:"chooseDirection",
		value:"horizontal",
		text:"选项排列方向：",
		type:"choose",
		select:(status)=>{
			if(status.valueType == "choose"){
				return true
			}
			return false
		},
		choices:[{
			value:"horizontal",
			text:"横向"
		},{
			value:"vertical",
			text:"竖向"
		}]
	},
	{
		name:"insteadOfName",
		text:"取代属性名显示：",
		type:"input",
	},
	{
		"name":"relationTitle",
		"text":"显示关联属性标题",
		"type":"checkBox",
		"value":true,
		"select":(status)=>{
			console.log(status)
			if(status.valueType == "relation"){
				return true
			}
			return false
		}
	},
	{
		"name":"relationAdd",
		"text":"允许添加新的关联单元",
		"type":"checkBox",
		"value":true,
		"select":(status)=>{
			if(status.valueType == "relation"){
				return true
			}
			return false
		}
	},{
		"name":"tagsAdd",
		"text":"显示新增标签",
		"type":"checkBox",
		"value":true,
		"select":(status)=>{
			if(status.valueType == "tags"){
				return true
			}
			return false
		}
	}
]
