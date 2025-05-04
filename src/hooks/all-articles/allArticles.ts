import { reactive  } from "vue";
import { showPopUp } from "../pages/popUp";
import { Chapter } from "@/class/Chapter";
import { Article } from "@/class/Article";
import { showAlert } from "../alert";
import { nanoid } from "nanoid";
import { deleteShowOnMain, showOnMain, showTargetOnMain } from "../pages/mainPage/showOnMain";
import { focusOnLeftPage, scrollToLeftTarget } from "../pages/leftPage";
import { cloneDeep } from "lodash";
import { translateToTextContent } from "../expression/textAreaContent";

export type From = {chapters:Chapter[],articles:Article[]}|Chapter

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
    // 创建一个新的文本
    export function createArticle(chapter:From){
        //创建文本对象
        let from:string[] = []
        //如果添加位置是文章，则添加这个文章到from
        if("from" in chapter){
            from = [...chapter.from,chapter.__key]
        }
        const now = Date.now()
        const newArticle:Article = new Article("","",from,nanoid(),now,now,0)
        return newArticle
    }
    //向目标章节中插入一个新的空文本,如果没有传入章节，则会使用当前显示的文章所在的章节
    export function addArticle(chapter?:From){
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
        const newArticle = createArticle(chapter)
        //添加到目标章节
        chapter.articles.push(newArticle)
        return newArticle
    }

    //弹窗：从目标位置删除指定的文本
    export function deleteArticlePopUp(from:From,article:Article){
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
    export function deleteArticle(from:From,article:Article){
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
    export function getArticleByKey(fromKey:string[],key:string){
        const chapter = getParentChapter(fromKey)
        if(chapter){
            return chapter.articles.find(article=>article.__key==key)
        }
    }

    //在弹窗中显示文章对象
    export function showArticleOnPopUp(article:Article){
        //未完成
    }

    //创建副本
    export function copyArticle(article:Article){
        const clone = cloneDeep(article)
        //修改key和编辑时间等
        clone.__key = nanoid();
        clone.createTime = Date.now()
        clone.updateTime = Date.now()
        return clone
    }

    /**
     * 递归遍历来源下的所有文本，执行回调函数并返回相应内容
     * @param from 某个文本的来源
     * @param callback 递归遍历文本并执行这个函数，记录返回值在一个列表中，并在结束时返回
     * @param filter? 接受callback函数的返回值。并返回布尔以此若为true则将该返回值加入结果列表
     * @param end? 接受callback函数的返回值，并返回布尔以此若为true则结束递归和遍历
     */
    export function mapArticle(from:From,
        callback:(article:Article,from:From)=>any,
        filter?:(any:any)=>boolean,
        end?:(any:any)=>boolean){
        const list:any[] = []
        for(let article of from.articles){
            const result = callback(article,from)
            //筛选
            if(!filter || filter(result)){
                list.push(result)
            }
            //提前结束
            if(end && end(result)){
                return list
            }
        }
        //递归
        from.chapters.forEach(chapter=>{
            list.push(...mapArticle(chapter,callback,filter,end))
        })
        return list
    }

    //获取文本的预览内容
    export function getArticlePreview(article:Article,num:number=100){
        //先翻译为文本内容
        const inner = translateToTextContent(article.inner)
        //截取一部分
        const slice = inner.slice(0,num)
        return slice
    }

//章节相关
    //创建一个章节
    export function createChapter(name:string,chapter?:From){
        let from:string[]
        if(chapter && "name" in chapter){
            from = [...chapter.from,chapter.__key]
        }
        else{
            from = []
        }
        
        const newChapter = new Chapter(name,[],[],from,nanoid())
        return newChapter
    }
    export function createChapterPopUp(from?:From):Promise<Chapter>{
        //来源的文本，用来生成title
        let fromText = "文章底部"
        if(from && "name" in from){
            fromText = from.name+"中"
        }
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
                returnValue:(name:string)=>{
                    const newChapter = createChapter(name,from)
                    resolve(newChapter)
                }
            })
        })
    }

    //向当前文章的底部插入一个章节,如果指定一个章节，则向这个章节中嵌套插入文章
    export function addChapter(chapter:Chapter,toChapter?:Chapter){
        //插入到章节
        if(toChapter){
            toChapter.chapters.push(chapter)
        }
        //插入到底部
        else{
            nowAllArticles.chapters.push(chapter)
        }
        return chapter
    }

    //打开创建章节弹窗，将返回的弹窗添加到指定位置
    export async function addChapterPopUp(chapter?:Chapter){
        const newChapter = await createChapterPopUp(chapter)
        addChapter(newChapter,chapter)
        return newChapter
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

    
    /**
     * 给出某个章节或文章的from属性值，找到其亲章节
     * @param from 该对象的from属性值
     * @param startParent? 可选，从该对象开始按from值搜索，若无则为当前文章
     * @returns 
     */
    function getParentChapter(from:string[],startParent:From=nowAllArticles):{chapters:Chapter[],articles:Article[]}{
        //在最外层
        if(from.length == 0){
            return startParent
        }
        //遍历from获取其亲章节
        let tmp_parent = startParent
        from.forEach((key)=>{
            const tmp = tmp_parent.chapters.find((chapter)=>
                chapter.__key == key
            )
            //替换当前亲章节
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

    /**
     * 通过key获取一个章节对象
     * @param from 该章节的from属性值
     * @param key 该章节的__key属性值
     * @returns 
     */
    export function getChapterByKey(from:string[],key:string|null,startParent?:From){
        //寻找父章节
        const parent = getParentChapter(from,startParent)
        if(parent){
            const tmp = parent.chapters.find((chapter)=>chapter.__key == key)
            if(tmp)return tmp
        }   
        throw new Error(`"未找到章节",${from},${key}`)
    }