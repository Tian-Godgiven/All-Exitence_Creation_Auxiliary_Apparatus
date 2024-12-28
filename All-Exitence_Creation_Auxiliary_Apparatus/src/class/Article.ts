export class Article{
	constructor(
		public title:string,
		public inner:any,
		public from:string[],
		public __key:string
	){}
}