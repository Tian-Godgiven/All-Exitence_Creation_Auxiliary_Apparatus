import { Article } from "@/class/Article"
import { Chapter } from "@/class/Chapter"
import { Exitence } from "@/class/Exitence"
import { Type } from "@/class/Type"
import { getArticleByKey, nowAllArticles } from "@/hooks/all-articles/allArticles"
import { nowAllExitence } from "@/hooks/all-exitence/allExitence"
import { ProjectLastTarget } from "@/hooks/project/project"
import { reactive } from "vue"

export type ShowOnMainItem = 
    //事物
    {
        target:Exitence
        from:string,
        type:"exitence"
    }|
    //文章
    {
        target:Article,
        from:string[],
        type:"article"
    }|
    //信息
    {
        target:"app"|"project",//分别对应初始应用页面和初始项目页面
        from:null,
        type:"info"
    }|
    //空状态
    {
        target:null,
        from:null,
        type:null
    }

//当前显示在主页面中的对象,这里写的是初始app对象
export const showOnMain = reactive<ShowOnMainItem>({
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

// 显示项目目标对象在主页面
export function showTargetOnMain({from,targetKey,type}:ProjectLastTarget){
    //先找到该对象
    if(type == "exitence"){
        const targetType = nowAllExitence.types.find((type)=>type.__key == from)
        const targetExitence = targetType?.exitence.find((exitence)=>exitence.__key == targetKey)
        //找不到对象返回false
        if(!targetType || !targetExitence){
            return false
        }
        showExitenceOnMain(targetType,targetExitence)
    }
    else if(type == "article"){
        //根据文章的from,从最外层找起
        const article = getArticleByKey(from,targetKey)
        console.log(from,targetKey,article)
        if(!article){
            return false
        }
        showArticleOnMain(article)
    }
}