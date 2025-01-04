export default interface Status{
	name:string,
	value:any,
	valueType:string,
	setting:{[key:string]:any},
	__key:null | number | string
}