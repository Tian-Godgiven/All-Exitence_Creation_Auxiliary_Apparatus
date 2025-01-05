export interface SettingOption<T=any>{
	name:string, //设置项名称 aka 关键字
	value?:any, //设置项值，不为空时，其为默认值
	text:string, //设置项文本
	type:'checkBox' | 'input' |'choose', //设置项类型
	select?:(target:T)=>boolean, //设置项筛选条件
	confrimValue?:(value:any)=>boolean  //设置项值确认条件
	inputs?:any, //输入性设置项的内容
	choices?:any[]|((target:T,...chooseTarget:any[])=>{value:any,text:string}[]), //选项性设置项的选项或生成选项的目标
	change?:(oldValue,newValue,target:T)=>void
}