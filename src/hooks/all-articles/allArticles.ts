import { reactive  } from "vue";
import { showPopUp } from "../pages/popUp";
import { Chapter } from "@/class/Chapter";
import { Article } from "@/class/Article";
import { showAlert } from "../alert";
import { nanoid } from "nanoid";
import { deleteShowOnMain, showOnMain, showTargetOnMain } from "../pages/mainPage/showOnMain";
import { focusOnLeftPage, scrollToLeftTarget } from "../pages/leftPage";

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
    console.log("当前所有文章",nowAllArticles)
}

//文本相关  
    //向目标章节中插入一个新的空文本,如果没有传入章节，则会使用当前显示的文章所在的章节
    export function addArticle(chapter?:Chapter|{chapters:Chapter[],articles:Article[]}){
        if(!chapter){
            //获取当前显示的对象,要求必须是文本
            if(showOnMain.type == "article"){
                const from = showOnMain.target.from
                const chapter = getParentChapter(from)
                if(chapter){
                    return addArticle(chapter)
                }   
            }
            throw new Error("创建文章失败")
        }
        //创建文本对象
        let from:string[] = []
        //如果添加位置是文章，则添加这个文章到from
        if("from" in chapter){
            from = [...chapter.from,chapter.__key]
        }
        
        const now = Date.now()
        const newArticle:Article = new Article("","",from,nanoid(),now,now,0)
        //添加到目标章节
        chapter.articles.push(newArticle)
        return newArticle
    }

    //弹窗：从目标位置删除指定的文本
    export function deleteArticlePopUp(from:{articles:Article[]},article:Article){
        let position = ""
        if("name" in from){
            position = from.name+"中的"
        }
        const title = article.title=="" ? "<未命名文本>":"文本："+article.title
        showAlert({
            "info":`删除${position}${title}？`,
            confirm:()=>{
                deleteArticle(from,article)
            }
        })
        
    }
    //删除文本
    export function deleteArticle(from:{articles:Article[]},article:Article){
        //如果删除的对象正在显示
        deleteShowOnMain(article)
        const index = from.articles.indexOf(article)
        from.articles.splice(index,1)
    }

    //聚焦到指定文章
    export function focusOnArticle(article:Article,showLeft:boolean=false){
        //将其所处的chapter展开
        //遍历from寻找章节，并依次展开这些章节
        const from = article.from
        const chapterFrom:string[] = []
        from.forEach(key=>{
            const chapter = getChapterByKey(chapterFrom,key)
            //将其展开
            expendChapter(chapter)
            //把他的key放进chapterFrom
            chapterFrom.push(chapter.__key)
        })
        //滚动到指定位置
        scrollToLeftTarget("article",article.__key)
        //在左侧页面聚焦这个文章
        focusOnLeftPage(article.__key,"all-article",showLeft)
        //在主页面显示这个文章
        showTargetOnMain({
            type:"article",
            target:article
        })
    }

    //通过from与key获取文章
    export function getArticleByKey(from:string[],key:string){
        const chapter = getParentChapter(from)
        if(chapter){
            return chapter.articles.find(article=>article.__key==key)
        }
    }

    //在弹窗中显示文章对象
    export function showArticleOnPopUp(article:Article){
        //未完成
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
    export function addChapterPopUp(chapter?:Chapter):Promise<Chapter>{
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
    export function focusOnChapter(chapter:Chapter,showLeft:boolean=false){
        //遍历from寻找章节，并依次展开这些章节
        const from = chapter.from
        const chapterFrom:string[] = []
        from.forEach(key=>{
            const chapter = getChapterByKey(chapterFrom,key)
            //将其展开
            expendChapter(chapter)
            //把他的key放进chapterFrom
            chapterFrom.push(chapter.__key)
        })
        //展开这个章节
        chapter.expending=true
        //移动到指定位置
        scrollToLeftTarget("chapter",chapter.__key)
        //将其聚焦
        focusOnLeftPage(chapter.__key,"all-article",showLeft)
    }
    //展开指定章节
    export function expendChapter(chapter:Chapter){
        chapter.expending = true
    }

    //删除指定章节
    export function deleteChapterPopUp(from:{chapters:Chapter[]},chapter:Chapter){
        //进行提示 
        showAlert({
            "info":`删除章节${chapter.name}及其中的所有内容？`,
            "confirm":()=>{
                deleteChapter(from,chapter)
            }
        })
    }
    function deleteChapter(from:{chapters:Chapter[]},chapter:Chapter){
        //判断其中的文章是否显示在主页面
        chapter.articles.forEach(article=>{
            deleteShowOnMain(article)
        })
        //从from中移除这个chapter
        const index = from.chapters.indexOf(chapter)
        from.chapters.splice(index,1)
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

    //给出某个章节或文章的from，找到其父章节
    function getParentChapter(from:string[]):{chapters:Chapter[],articles:Article[]}{
        //在最外层
        if(from.length == 0){
            //返回项目总文本
            return nowAllArticles
        }
        //遍历from获取其父章节
        let tmp_parent = nowAllArticles
        from.forEach((key)=>{
            const tmp = tmp_parent.chapters.find((chapter)=>
                chapter.__key == key
            )
            //替换当前父章节
            if(tmp){
                tmp_parent = tmp
            }
            else{
                showAlert({
                    info:"无法找到目标章节，或许已经删除",
                    confirm:()=>{}
                })
                return false
            }
        })
        return tmp_parent
    }

    //通过from和key找到某个chapter
    export function getChapterByKey(from:string[],key:string|null){
        //寻找父章节
        const parent = getParentChapter(from)
        if(parent){
            const tmp = parent.chapters.find((chapter)=>chapter.__key == key)
            if(tmp)return tmp
        }   
        throw new Error(`"未找到章节",${from},${key}`)
    }