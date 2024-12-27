import { reactive  } from "vue";
import { showPopUp } from "../pages/popUp";
import { Chapter } from "@/class/Chapter";
import { Article } from "@/class/Article";
import { showAlert } from "../alert";

//当前文章
export const nowAllArticles = reactive<{
    chapters:Chapter[],
    articles:Article[]
}>({chapters:[],articles:[]})

//改变当前文章
export function changeNowAllArticles(newAllArticles:any){
    //不知道为什么有时会传一个字符串过来？？？
    if(typeof newAllArticles != "object"){
        newAllArticles = JSON.parse(newAllArticles)
    }
    nowAllArticles.chapters = newAllArticles.chapters
    nowAllArticles.articles = newAllArticles.articles
}

//向当前文章的底部插入一个新章节,如果指定一个章节，则向这个章节中嵌套插入文章
export function addChapter(chapterName:string,chapter?:Chapter){
    const newChapter = new Chapter(chapterName,[],[])
    if(chapter){
        chapter.chapters.push(newChapter)
    }
    else{
        nowAllArticles.chapters.push(newChapter)
    }
    console.log(nowAllArticles)
    return newChapter
}
    
//向当前章节中插入一个空文本
export function addArticle(chapter:Chapter){
    const newArticle:Article = new Article("","")
    chapter.articles.push(newArticle)
    return newArticle
}

//打开创建章节弹窗，获得用户输入的弹窗名称
export function createChapter(chapter?:Chapter):Promise<Chapter>{
    return new Promise((resolve)=>{
        showPopUp({
            name:"插入章节",
            vueName:"createChapter",
            mask:true,
            buttons:[],
            returnValue:(chapterName:string)=>{
                const newChapter = addChapter(chapterName,chapter)
                resolve(newChapter)
            }
        })
    })
}

//聚焦到指定章节
export function focusOnChapter(chapter:Chapter){
    //将其展开

    //将其聚焦
}

//聚焦到指定文章
export function focusOnArticle(article:Article){
    //将其所处的chapter展开

    //在主页面显示该文章
}

//更新指定文章
export function updateChapter(chapter:Chapter){
    showPopUp({
        name:"编辑文章",
        mask:true,
        buttons:[],
        vueName:"updateChapter",
        props:{
            chapter
        },
        returnValue:(newName:string)=>{
            chapter.name = newName
        }
    })
}

//删除指定章节
export function deleteChapter(from:any,chapter:Chapter){
    
    console.log("//即将进行删除",from,chapter)
    //进行提示 
    showAlert({
        "info":`删除章节${chapter.name}及其中的所有内容？`,
        "confirm":()=>{
            //从from中移除这个chapter
            const index = from.chapters.indexOf(chapter)
            from.chapters.splice(index,1)
        }
    })
}