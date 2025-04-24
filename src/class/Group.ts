//【万物】/ 【分类】 / 【分组】
export class Group{
	constructor(
		public name:string,
		public rules:string[],
		public setting:{},
		public __key:string,
		public typeKey:string,
		public expending:boolean = true
	){}
	
}