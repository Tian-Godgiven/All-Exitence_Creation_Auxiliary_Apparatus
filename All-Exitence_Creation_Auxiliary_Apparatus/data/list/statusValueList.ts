// 属性值类型表
export let statusValueTypeList = [
	{value : "string",text : "文字"},
	{value : "num",text : "数值"},
	{value : "bool",text : "是否"},
	{value : "range",text : "范围"},
	{value : "choose",text : "选项"},
	{value : "date",text : "时间"},
	{value : "exitence",text : "事物"},
	{value : "multi",text : "复合"},
	{value : "status",text: "嵌套",}
]
// 属性值显示方式表
export let statusShowTypeList = [
	{value:"none",text:"无样式",defaultType:["date","multi","status"],compatibleType:["string","num"]},
	{value:"downLine",text:"下划线",defaultType:["string","num"],compatibleType:["date","multi","status"]},
	{value:"inputBox",text:"输入框",defaultType:[],compatibleType:["string","num","date","multi"]},
	{value:"range",text:"范围划动",defaultType:["range"],compatibleType:["num"]},
	{value:"vertical",text:"水平排列",defaultType:["exitence"],compatibleType:[]},
	{value:"horizen",text:"垂直排列",defaultType:[],compatibleType:["exitence"]},
	{value:"choiceV",text:"选项水平排列",defaultType:["choose"],compatibleType:[]},
	{value:"choiceH",text:"选项垂直排列",defaultType:[],compatibleType:["choose"]},
	{value:"select",text:"下拉选项框",defaultType:[],compatibleType:["choose"]},
	{value:"switch",text:"左右滑动开关",defaultType:["bool"],compatibleType:[,"choose"]},
	{value:"turnOn",text:"明暗开关",defaultType:[],compatibleType:["bool","choose"]}
]
// 属性值设置项表
export let statusSettingList = [
	{name:"hoverBox",value:"false",text:"修改时显示输入框",default:true,type:"turnOn"},
	{name:"exitenceBox",value:["[","]"],text:"事物",type:"input",inputs:["左侧","右侧"]},
	{name:"exitenceSeparator",value:",",text:"事物间隔",type:"input",inputs:[""],select:(status)=>{
		if(status.valueType == "exitence" && status.showType == "vertical"){
			return true
		}
	}},
	{name:"defaultOption",text:"默认选项",type:"choose",select:(status)=>{
		if(status.valueType == "bool" || status.valueType == "choose"){
			return true
		}
	}},
]