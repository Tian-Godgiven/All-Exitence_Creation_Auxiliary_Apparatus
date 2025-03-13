//分类或事物所使用的完整属性
export default interface Status{
	name:string,
	value:any,
	valueType:string,
	setting:{[key:string]:any},
	__key:string
}