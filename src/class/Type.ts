// 【万物】/ 分类

import { Group } from "./Group";
import { Exitence } from "./Exitence";
import Status from "@/interfaces/exitenceStatus";

export class Type{
	constructor(
		public name:string, //分类名，分类名称在项目中是唯一的，但由于其可变性，仍然会使用key作为唯一标识
		public typeStatus:Status[], //分类的属性数组与其对应的设置
		public setting:{}, //分类设置
		public groups:Group[], //分组数组
		public exitence:Exitence[], //存在数组 
		public __key:any,
		public expending:boolean = true,
	){}
}