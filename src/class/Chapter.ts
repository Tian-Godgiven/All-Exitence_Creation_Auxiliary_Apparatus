import { Article } from "./Article";

/**
 * @param from 依次存储章节的亲章节的key，最外层的章节为空
 */
export class Chapter{
    constructor(
        public name:string,
        public articles:Article[],
        public chapters:Chapter[],
        public from:string[],
        public __key:string,
        public expending:boolean=true,
    ){}
}