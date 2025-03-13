//【万物】/ 【分类】 / 【分组】

import { nanoid } from "nanoid";

export class Group{
	constructor(
		public name:string,
		public rules:string[],
		public setting:{},
		public __key:string = nanoid(),
		public expending:boolean = true
	){}
	
}