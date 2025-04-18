import { Article } from "@/class/Article"
import { Exitence } from "@/class/Exitence"
import { ProjectLastTarget } from "@/hooks/project/project"
import { reactive } from "vue"

export type ShowOnMainItem = 
    {scrollTop:number} & (
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
    })

//当前显示在主页面中的对象,这里写的是初始app对象
export const showOnMain = reactive<ShowOnMainItem>({
    target:null,
    from:null,
    type:null,
    scrollTop:0
}) 

// 显示事物在主页面
export function showExitenceOnMain(exitence:Exitence){
    showOnMain.from = exitence.typeKey
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

// 显示指定对象在主页面
type ShowOnMainTarget = {
        type:"exitence",
        target:Exitence
    }|{
        type:"article",
        target:Article
    }|{
        type:"info",
        target:"app"|"project"
    }
export function showTargetOnMain({type,target}:ShowOnMainTarget){
    //保存上一个对象的信息
    saveLastTargetOnMain()
    //先找到该对象
    if(type == "exitence"){
        showExitenceOnMain(target)
    }
    else if(type == "article"){
        showArticleOnMain(target)
    }
    else if(type == "info"){
        switch(target){
            case "app":
                showInitialAppOnMain()
                break;
            case "project":
                showInitialProjectOnMain()
                break;
        }
    }
}

//保存当前显示对象的信息
function saveLastTargetOnMain(){
    //保存其当前的滚动位置
    const event = new Event('getShowOnMainScrollTop');
    window.dispatchEvent(event);
    const scrollTop = showOnMain.scrollTop
    const target = showOnMain.target
    //保存在这个对象中
    if(target && typeof target != "string"){
        target.lastScrollTop = scrollTop
    }
}

//删除的对象正显示在主页面
export function deleteShowOnMain(target:Exitence|Article){
    if(target == showOnMain.target){
        //切换到项目初始页面
        showTargetOnMain({
            type:"info",
            target:"project"
        })
    }
}

//获取当前主页面显示对象的信息,用于保存
export function getShowOnMainInfo(){
    //空状态报错
    if(!showOnMain.type){console.error("主页面对象为空！",showOnMain);return}
    //让该对象保存一下
    saveLastTargetOnMain()
    //记录当前主页面的对象
    if(["article","exitence","info"].includes(showOnMain.type)){
        //对象的key
        const targetKey = function(){
            if(showOnMain.type == "info"){
                return showOnMain.target
            }
            return showOnMain.target.__key
        }()
        const info = {
            type:showOnMain.type,//对象类型
            from:showOnMain.from,//对象来源
            targetKey,//对象key
        } as ProjectLastTarget
        return info
    }
}