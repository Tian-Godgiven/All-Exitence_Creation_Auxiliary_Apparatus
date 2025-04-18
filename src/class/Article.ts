export class Article{
	constructor(
		public title:string, //文章标题
		public inner:any, //文章内容
		public from:string[],//文章所在的每一级来源的key，若为最外层则为空
		public __key:string,//文章标识符
		public createTime:number, //文章创建时间
		public updateTime:number, //文章上一次编辑时间
		public lastScrollTop:number//上一次看到的滚动位置
	){}
}