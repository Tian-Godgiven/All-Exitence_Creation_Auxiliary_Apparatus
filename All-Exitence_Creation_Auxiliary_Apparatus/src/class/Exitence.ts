// 【万物】/【分类】/ 【存在】

export class Exitence{
	constructor(
		public name:string,
		public status:any[],
		public typeName:string,
		public setting:{[key:string]:any},
		public __key:string//由nanoId生成的唯一标识符
	){}
}