import { reactive  } from "vue";

//当前文章
export const nowAllArticles = reactive({chapter:[],article:[]})

//改变当前文章
export function changeNowAllArticles(newAllArticles:any){
    //不知道为什么有时会传一个字符串过来？？？
    if(typeof newAllArticles != "object"){
        newAllArticles = JSON.parse(newAllArticles)
    }
    nowAllArticles.chapter = newAllArticles.chapter
    nowAllArticles.article = newAllArticles.article
}