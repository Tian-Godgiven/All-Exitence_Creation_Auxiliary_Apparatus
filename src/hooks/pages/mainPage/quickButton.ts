import { addArticle, addChapterPopUp, focusOnArticle, focusOnChapter } from "@/hooks/all-articles/allArticles"
import { createExitencePopUp, createTypePopUp, focusOnExitence, focusOnType } from "@/hooks/all-exitence/allExitence"
import { computed, reactive} from "vue"
import { nowLeftPageMode } from "../leftPage"

export type QuickPanelItem = {
    label:string//显示的文本
    click:(()=>void)|(()=>Promise<void>)//点击执行的事件
}
type QuickPanelList = {
    "all-exitence"?:QuickPanelItem[],
    "all-article"?:QuickPanelItem[],
    "all"?:QuickPanelItem[]
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
        }},
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

//快捷面板的额外功能，同样支持模式切换
const quickPanelExtraList = reactive<Record<string,QuickPanelList>>({})
//添加额外功能，需要传入一个标识，重复传入时只会改变标识对应的额外功能
export function addQuickPanelAbility(id:string,abilityList:QuickPanelList){
    //找到对应的id,若没有则创建
    const list = quickPanelExtraList[id]
    if(!list){
        quickPanelExtraList[id] = {}
    }
    //将其中的内容覆盖为传入的功能列表
    quickPanelExtraList[id] = abilityList
}

//主页面快捷面板的功能
export const quickPanelList = computed<QuickPanelItem[]>(()=>{
    const nowMode = nowLeftPageMode.value
    //基础功能
    const list:QuickPanelItem[] = [...quickPanelBaseList[nowMode]]
    //额外功能中的按模式划分功能
    const modeList:QuickPanelItem[] = []
    //额外功能中的不按模式划分的功能
    const allList:QuickPanelItem[] = []
    for(let key in quickPanelExtraList){
        const abilityList = quickPanelExtraList[key]
        const extraMode = abilityList[nowMode]
        if(extraMode){
            modeList.push(...extraMode)
        }
        //额外功能中的不按模式划分的功能
        const extraAll = abilityList["all"]
        if(extraAll){
            allList.push(...extraAll)
        }
    }
    list.push(...modeList)
    list.push(...allList)   
    
    return list
})