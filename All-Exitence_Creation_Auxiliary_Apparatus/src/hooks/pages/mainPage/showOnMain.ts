import { Article } from "@/class/Article"
import { Chapter } from "@/class/Chapter"
import { Exitence } from "@/class/Exitence"
import { Type } from "@/class/Type"
import { nowAllArticles } from "@/hooks/all-articles/allArticles"
import { nowAllExitence } from "@/hooks/all-exitence/allExitence"
import { reactive } from "vue"

//当前显示在主页面中的对象,这里写的是初始app对象
export const showOnMain:any = reactive<{target:any,from:any,type:"article"|"exitence"|"info"|null}>({
    target:null,
    from:null,
    type:null
}) 

// 显示事物在主页面
export function showExitenceOnMain(type:Type,exitence:Exitence){
    showOnMain.from = type.__key
    showOnMain.target = reactive(exitence)
    showOnMain.type = 'exitence'
}
// 显示文章
export function showArticleOnMain(article:Article){
    showOnMain.from = article.from
    showOnMain.target = reactive(article)
    showOnMain.type = 'article'
}
// 显示软件初始页面在主页面
export function showInitialAppOnMain(){
    showOnMain.from = null
    showOnMain.target = "app"
    showOnMain.type = "info"
}

// 显示项目初始页面在主页面
export function showInitialProjectOnMain(){
    showOnMain.from = null
    showOnMain.target = "project"
    showOnMain.type = "info"
}

// 显示目标对象在主页面
export function showTargetOnMain({from,target,type}:{from:string|string[],target:string,type:"exitence"|"article"}){
    //先找到该对象
    if(type == "exitence"){
        const targetType = nowAllExitence.types.find((type)=>type.__key == from)
        const targetExitence = targetType?.exitence.find((exitence)=>exitence.__key == target)
        //找不到对象返回false
        if(!targetType || !targetExitence){
            return false
        }
        showExitenceOnMain(targetType,targetExitence)
    }
    else{
        //根据文章的from,从最外层找起
        let targetFrom:any = nowAllArticles
        for(let key of from){
            targetFrom = targetFrom.chapters.find((chapter:Chapter)=>chapter.__key == key)
        }
        const targetArticle = targetFrom?.articles.find((article:Article)=>article.__key == target)
        if(!targetArticle){
            return false
        }
        showArticleOnMain(targetArticle)
    }
}