import { Article } from "@/class/Article"
import { Chapter } from "@/class/Chapter"
import { nowAllArticles } from "@/hooks/all-articles/allArticles"
import { reactive } from "vue"

export type Item = {
    name:string,
    target:Chapter,
    child:Item[],
    state:boolean|"mid"|"disabled",
}|{
    name:string,
    target:Article,
    state:boolean|"mid"|"disabled",
}

//返回所有文章组成的树形结构列表
export function getList():Item[]{
    const list:Item[] = []
    //遍历当前所有文章
    nowAllArticles.chapters.forEach(chapter=>{
        list.push(getChapterItem(chapter))
    })
    nowAllArticles.articles.forEach(article=>{
        list.push(getArticleItem(article))
    })
    return reactive(list)

    function getChapterItem(chapter:Chapter):Item{
        return {
            name:chapter.name,
            target:chapter,
            child:getChapterChildItem(chapter),
            state:false
        }
    }
    function getChapterChildItem(chapter:Chapter){
        const childItems:Item[] = []
        //章节的章节
        chapter.chapters.forEach(chapter=>{
            childItems.push(getChapterItem(chapter))
        })
        chapter.articles.forEach(article=>{
            childItems.push(getArticleItem(article))
        })
        return childItems
    }
    function getArticleItem(article:Article):Item{
        return {
            name:article.title,
            target:article,
            state:false
        }
    }
}

//获取所有选中的文章
export function getSelectedArticles(list:Item[]){
    type ListItem  = {sourceKey:string[],targetKey:string[]}
    const chosenArticleList:ListItem[] = []
    //遍历列表
    list.forEach(item=>{
        handleItemSelection(item,[])
    })
    return chosenArticleList

    // 处理每个子元素
    function handleItemSelection(child: Item,from:string[]) {
        if (child.state === "disabled" || child.state === false){return;} 
        //其还有子元素,说明是章节
        if ('child' in child) {
            const targetKey:string[] = []
            const newFrom = [...from,child.target.__key]
            child.child.forEach(newchild => {
                if("child" in newchild){
                    handleItemSelection(newchild,newFrom)
                }
                //如果子元素不是章节且被选中，则将其添加到targetKey中并返回
                else{
                    if(newchild.state === "disabled" || newchild.state === false) return;
                    targetKey.push(newchild.target.__key)
                }
            });
            if(targetKey.length>0){
                chosenArticleList.push({
                    sourceKey:newFrom,
                    targetKey
                })
            }
        }
    }
}