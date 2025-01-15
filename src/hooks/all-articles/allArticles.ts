import { reactive  } from "vue";
import { showPopUp } from "../pages/popUp";
import { Chapter } from "@/class/Chapter";
import { Article } from "@/class/Article";
import { showAlert } from "../alert";
import { nanoid } from "nanoid";

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

//文本相关
    //向目标章节中插入一个新的空文本
    export function addArticle(chapter:Chapter){
        //继承章节的from
        const from = [...chapter.from,chapter.__key]
        const newArticle:Article = new Article("","",from,nanoid())
        chapter.articles.push(newArticle)
        return newArticle
    }

    //从目标位置删除指定的文本
    export function deleteArticle(from:any,article:Article){
        const position = from == nowAllArticles ? from.name+"中的":""
        const title = article.title=="" ? "<未命名文本>":"文本："+article.title
        showAlert({
            "info":`删除${position}${title}？`,
            confirm:()=>{
                const index = from.articles.indexOf(article)
                from.articles.splice(index,1)
            }
        })
        
    }

    //聚焦到指定文章
    export function focusOnArticle(article:Article){
        //将其所处的chapter展开
        console.log(article)
        //在主页面显示该文章
    }


    

//章节相关
    //向当前文章的底部插入一个新章节,如果指定一个章节，则向这个章节中嵌套插入文章
    export function addChapter(chapterName:string,chapter?:Chapter){
        //如果指定一个章节，则其继承章节的from，否则为from为空
        const from = chapter? [...chapter.from,chapter.__key] : []
        const newChapter = new Chapter(chapterName,[],[],from,nanoid())
        if(chapter){
            chapter.chapters.push(newChapter)
        }
        else{
            nowAllArticles.chapters.push(newChapter)
        }
        return newChapter
    }

    //打开创建章节弹窗，获得用户输入的弹窗名称
    export function createChapter(chapter?:Chapter):Promise<Chapter>{
        //来源的文本，用来生成title
        const fromText = chapter?chapter.name+"中":"文章底部"
        return new Promise((resolve)=>{
            showPopUp({
                name:"插入章节",
                vueName:"createChapter",
                mask:true,
                buttons:[],
                props:{
                    title:`向${fromText}插入章节`
                },
                size:{
                    height:"auto"
                },
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
        console.log(chapter)
        //将其聚焦
    }

    //删除指定章节
    export function deleteChapter(from:any,chapter:Chapter){
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

    //更新指定章节的名称
    export function updateChapter(chapter:Chapter){
        showPopUp({
            name:"重命名章节",
            mask:true,
            buttons:[],
            vueName:"updateChapter",
            props:{
                chapter
            },
            size:{
                height:"auto"
            },
            returnValue:(newName:string)=>{
                chapter.name = newName
            }
        })
    }