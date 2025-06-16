import { closePopUp, PopUp, showPopUp } from "@/hooks/pages/popUp";
import { SupportAbilitySignUpItem } from "@/static/list/supportAbilityList";
import { ref, shallowRef } from "vue";
import Search from "./popUp/Search.vue";
import { Exitence } from "@/class/Exitence";
import { Article } from "@/class/Article";
import { translateToTextContent } from "@/hooks/expression/textAreaContent";
import { getExitencePreview, getExitenceStatusByKey, getTypeByKey, ifExitenceInGroup, nowAllExitence } from "@/hooks/all-exitence/allExitence";
import { getArticlePreview, getChapterByKey, mapArticle, nowAllArticles } from "@/hooks/all-articles/allArticles";
import { hidePage } from "@/hooks/pages/pageChange";
import { nowProjectInfo, nowProjectList, ProjectInfo, readProjectData } from "@/hooks/project/project";
import { Type } from "@/class/Type";
import { Chapter } from "@/class/Chapter";

//注册搜素组件
export const searchSighUpItem:SupportAbilitySignUpItem = {
    name:"search",
    init:()=>{},//不需要初始化
    call:()=>showSearchPopUp()
}


//搜索关键词
export const input = ref<string>("")
//搜索范围
export const range = ref<"nowProject"|"allProject">("nowProject")
//搜索对象  
export const target = ref<("article"|"exitence")[]>(["article","exitence"])
//搜索结果
export const result  = ref<SearchResult[]>([])
//显示搜索弹窗
let popUp:PopUp|false = false
function showSearchPopUp(){
    //同时还会快速隐藏左侧页面
    hidePage("left",15)
    popUp = showPopUp({
        vue:shallowRef(Search),
        name:"搜索",
        "buttons":[],
        "mask":true,
        "size":{
            height:"auto"
        }
    })
}
//隐藏搜索弹窗，注意搜索和输入都会保存
export function hideSearchPopUp(){
    if(popUp){
        closePopUp(popUp)
    }
   
}

//在指定范围中搜索，返回找到的对象和内容
export type SearchResult = {
    title:string,
    preview:string,
    projectPath?:string,//项目路径，搜索所有项目时存在
    projectTitle?:string,//项目标题，同上
}&({
    type:"exitence",
    target:Exitence,
}|{
    type:"article",
    target:Article,
})
export async function searchAt(keyWord:string,target:("exitence"|"article")[],range:"nowProject"|"allProject"){
    //关键词为空
    if(keyWord.length == 0||!keyWord){
        return []
    }
    const result:SearchResult[] = []
    //在当前项目中搜索内容
    if(range == "nowProject"){
        //搜索事物
        if(target.includes("exitence")){
            searchExitenceFrom(nowAllExitence)
        }
        //搜索文章
        if(target.includes("article")){
            searchArticleFrom(nowAllArticles)
        }
    }
    //搜索所有项目，当前项目放在最上面，要添加项目标题和项目路径
    if(range == "allProject"){
        //先搜索当前项目
        if(target.includes("exitence")){
            searchExitenceFrom(nowAllExitence,nowProjectInfo)
        }
        //搜索文章
        if(target.includes("article")){
            searchArticleFrom(nowAllArticles,nowProjectInfo)
        }
        //获取所有其他项目路径
        const projectList = nowProjectList.value
        for(let info of projectList){
            //排除当前项目
            if(info.pathName == nowProjectInfo.pathName)continue;
            //按需获取该项目中的事物/文章并进行搜索
            if(target.includes("exitence")){
                const allExitence = await readProjectData(info.pathName,"exitence") as {types:Type[]}
                searchExitenceFrom(allExitence,info)
            }
            if(target.includes("article")){
                const allArticles = await readProjectData(info.pathName,"article") as {articles:Article[],chapters:Chapter[]}
                searchArticleFrom(allArticles,info)
            }
        }
    }
    return result

    function searchExitenceFrom(allExitence:{types:Type[]},projectInfo?:ProjectInfo){
        allExitence.types.forEach(type=>{
            type.exitence.forEach(exitence=>{
                const tmp = searchExitence(exitence,keyWord)
                if(tmp){
                    //添加项目信息
                    if(projectInfo){
                        tmp.projectPath = projectInfo.pathName;
                        tmp.projectTitle = projectInfo.name
                    }
                    result.push(tmp)
                }
            })
        })
    }
    function searchArticleFrom(allArticles:{chapters:Chapter[],articles:Article[]},projectInfo?:ProjectInfo){
        mapArticle(allArticles,(article)=>{
            const tmp = searchArticle(article,keyWord,allArticles)
            if(tmp){
                //添加项目信息
                if(projectInfo){
                    tmp.projectPath = projectInfo.pathName;
                    tmp.projectTitle = projectInfo.name
                }
                result.push(tmp)
            }
        })
    }
}
function searchExitence(exitence:Exitence,keyWord:string):SearchResult|false{
    //搜索事物属性值
    for(let status of exitence.status){
        //判断属性值中是否包含关键字
        const text = translateToTextContent(status.value,true)
        if(text.includes(keyWord)){
            //获取属性名
            const type = getTypeByKey(exitence.typeKey)
            if(!type)return false;
            const fullStatus = getExitenceStatusByKey(status.__key,exitence.status,type.typeStatus)
            if(!fullStatus)return false;
            const preview = `${fullStatus.name}：${text}`
            //检查一下事物是否在某个分组中
            const group = type.groups.find(group=>{
                return ifExitenceInGroup(exitence,group)
            })
            //组合title
            const title = group?`${type.name}/${group.name}/${exitence.name}`:
                                `${type.name}/${exitence.name}`
            return {
                title,
                type:"exitence",
                target:exitence,
                preview,
            }
        }
    }
    //搜不到，就搜一下事物的名称
    if(exitence.name.includes(keyWord)){
        //获取分组
        const type = getTypeByKey(exitence.typeKey)
        if(!type)return false;
        //检查一下事物是否在某个分组中
        const group = type.groups.find(group=>{
            return ifExitenceInGroup(exitence,group)
        })
        //组合title
        const title = group?`${type.name}/${group.name}/${exitence.name}`:
                            `${type.name}/${exitence.name}`
        //预览内容
        const preview = getExitencePreview(exitence,type)
        return {
            title,
            type:"exitence",
            target:exitence,
            preview,
        }
    }
    return false
}
function searchArticle(article:Article,keyWord:string,startParent?:{chapters:Chapter[],articles:Article[]}):SearchResult|false{
    //判断文本的内容
    const text = translateToTextContent(article.inner)
    const index = text.indexOf(keyWord)
    if(index>=0){
        const previewLength = 200
        const keywordLength = keyWord.length;
        // 计算前后各需要多少字符
        let start = index - Math.floor((previewLength - keywordLength) / 2);
        let end = index + keywordLength + Math.floor((previewLength - keywordLength) / 2);
        // 防止越界处理
        if (start < 0) {
            start = 0;
            end = previewLength;  // 如果开始位置小于0，直接截取前200个字符
        }
        if (end > text.length) {
            end = text.length;
            start = Math.max(0, end - previewLength);  // 如果结束位置超出文本长度，调整开始位置
        }
        // 截取前后平衡的预览文本
        const preview = text.slice(start, end);
        return {
            title:getTitle(),
            preview,
            type:"article",
            target:article
        }
    }
    //否则判断文本的标题
    else if(article.title.includes(keyWord)){
        return {
            title:getTitle(),
            preview:getArticlePreview(article,200),
            type:"article",
            target:article
        }
    }
    return false

    //文本所属的章节 
    function getTitle(){
        let title = ""
        //递归查找其所属的章节
        const from = [...article.from];
        while (from.length > 0) {
            const key = from.pop()
            if(!key)break;
            const chapter = getChapterByKey(from,key,startParent)
            if(chapter){
                title = chapter.name +"/"+ title;
            }
        }
        //最后加上文本的标题
        let articleTitle = article.title =="" ? "未命名":article.title
        title+=articleTitle
        return title
    }
}
