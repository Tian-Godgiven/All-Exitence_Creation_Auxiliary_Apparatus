export type SettingTarget = Object & (
|{
	setting:Record<string,any>
}|{
	setting?:never
})
// 设置框对象
export type SettingProps<T extends SettingTarget,S> = {
	//设置作用的对象，所有的设置值都会修改到该对象上
	target:T,
	//设置对象所用的设置项列表，要求每一项都满足如下所示的设置项要求
	optionList:SettingOption<T|S>[],
	//设置目标的设置项内的初始值，若为空则会使用target.setting的值
	defaultSetting?:Record<string,any>,
	//参与筛选函数的对象，必须是composed类型的值
	//若为空则会设置为composed(()=>target)，用于执行select函数的目标
	//执行过程只会传入其.value（这也是为什么必须要composed的原因
	selectTarget?:S,
	//参与选项生成函数的对象，传入choice函数的辅助值，见下方的choose类型的相关函数
	chooseTarget?:any[]
}

// 设置项的类型,T为设置目标的类型
export type SettingOption<T,S> = {
	name:string, //设置项名称/关键字
	text:string, //设置项文本
	select?:(target:T|S)=>boolean, //设置项筛选条件
	confirmValue?:(value:any)=>boolean  //设置项值确认条件，若为空则不做限制
	change?:(oldValue,newValue,target:T)=>void //设置项值改变时的回调函数
} & (
//checkbox类
{ 
	value?:boolean,//选项的默认值
	type:'checkBox'
}|
//输入类
{
	value?:string|string[],
	type:'input', //输入类
	inputs?:string[], //多个输入框的文本内容
}|
//choose选项类
{
	value?:string,
	type:'choose', //选项类
	//选项性设置项的选项或生成选项的函数
	choices:{value:any,label:string}[] | (
		(target:T,...chooseTarget:any[])=>{value:any,label:string}[]
	), 
})