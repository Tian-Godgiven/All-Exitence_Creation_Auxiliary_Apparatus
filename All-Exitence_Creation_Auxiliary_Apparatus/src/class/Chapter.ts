import { Article } from "./Article";

export class Chapter{
    constructor(
        public name:string,
        public articles:Article[],
        public chapters:Chapter[]
    ){}
}