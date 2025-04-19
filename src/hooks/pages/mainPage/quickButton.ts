import { addArticle, addChapterPopUp, focusOnArticle, focusOnChapter } from "@/hooks/all-articles/allArticles"
import { createExitencePopUp, createTypePopUp, focusOnExitence, focusOnType } from "@/hooks/all-exitence/allExitence"
import { computed } from "vue"
import { nowLeftPageMode } from "../leftPage"

export type QuickPanelItem = {
    label:string//显示的文本
    click:()=>void//点击执行的事件
}

//快捷面板的基础功能，随当前模式切换
export const quickPanelBaseList = {
    "all-exitence":[
        {label:"创建事物",click:async()=>{
            const exitence = await createExitencePopUp()
            focusOnExitence(exitence,false)
        }},
        {label:"创建分类",click:async()=>{
            const type = await createTypePopUp()
            focusOnType(type,true)
        }}
    ],
    "all-article":[
        {label:"创建文章",click:()=>{
            const article = addArticle();
            //移动到该文章,不展开左侧页面
            focusOnArticle(article,false)
        }},
        {label:"创建章节",click:async()=>{
            const chapter = await addChapterPopUp()
            //聚焦到该章节,展开左侧页面
            focusOnChapter(chapter,true)
        }}
    ]
}

//主页面快捷面板的功能
export const quickPanelList = computed<QuickPanelItem[]>(()=>{
    //基础功能
    const list = [...quickPanelBaseList[nowLeftPageMode.value]]
    return list
})