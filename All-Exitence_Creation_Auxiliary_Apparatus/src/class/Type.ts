// 【万物】/ 分类

import { Group } from "./Group";
import { Exitence } from "./Exitence";

export class Type{
	constructor(
		public name:string, //分类名
		public typeStatus:{}, //分类的属性与其对应的设置
		public groups:Group[], //分组数组
		public exitence:Exitence[], //存在数组 
		public setting:{} //分类设置
	){}
}