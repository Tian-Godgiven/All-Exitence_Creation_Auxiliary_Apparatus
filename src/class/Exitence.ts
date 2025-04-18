//事物内部所使用的属性
export type ExitenceStatus = {
	name?:string,
	value:any,
	valueType?:string,
	setting?:{[key:string]:any},
	__key:string
}

// 【万物】/【分类】/ 【事物】
export class Exitence{
	constructor(
		public name:string,
		public status:ExitenceStatus[],
		public typeKey:string,
		public setting:{[key:string]:any},
		public __key:string,//由nanoId生成的唯一标识符
		public lastScrollTop:number//上一次看到的位置
	){}
}
