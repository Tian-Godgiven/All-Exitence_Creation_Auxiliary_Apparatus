import { Article } from "@/class/Article"
import { Chapter } from "@/class/Chapter"
import { nowAllArticles } from "@/hooks/all-articles/allArticles"
import { reactive, ref } from "vue"

//所选择的文章的时间对象，包含更新时间和创建时间
export const targetStatus = ref<"updateTime"|"createTime">("updateTime")

//用于获取所有文章列表的数据结构
export type Item = CItem | AItem
type CItem = {
    name:string,
    target:Chapter,
    child:(AItem|CItem)[],
    state:boolean|"mid",
}
type AItem = {
    name:string,
    target:Article,
    state:boolean|"mid",
}

//返回所有文章组成的树形结构列表，用于生成选项
export function getList(){
    const list:Item[] = []
    //遍历当前所有文章
    nowAllArticles.chapters.forEach(chapter=>{
        list.push(getChapterItem(chapter))
    })
    nowAllArticles.articles.forEach(article=>{
        list.push(getArticleItem(article))
    })
    return reactive(list)

    function getChapterItem(chapter:Chapter):CItem{
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
    function getArticleItem(article:Article):AItem{
        return {
            name:article.title,
            target:article,
            state:false
        }
    }
}

//返回的列表的实际样貌
export type ChooseArticleList = ListItem[]
type ListItem  = {
    sourceKey:string[],
    target:{
        name:string
        key:string
    }[]
}

//获取所有选中的文章，用于生成时间轴
export function getSelectionArticles(list:Item[]){
    const chosenList:ListItem[] = []
    const noChapterList:ListItem = {sourceKey:[],target:[]}
    let minTime = Infinity
    //遍历列表
    list.forEach(item=>{
        const from:string[] = []
        if (item.state === false){return;} 
        //其还有子元素,说明是章节
        if ('child' in item) {
            chapterChild(item,from)
        }
        //没有子元素了，说明是最外层文章，直接添加到无章节列表中
        else{
            //判断其对应的时间是否小于最小时间
            const time = item.target[targetStatus.value]
            if(time < minTime){
                minTime = time
            }
            noChapterList.target.push({
                key:item.target.__key,
                name:item.name
            })
        }
    })
    //添加上无章节文章
    chosenList.push(noChapterList)
    //返回结果
    return {chosenList,minTime}
    // 递归处理章节中的子元素
    function chapterChild(item:CItem,from:string[]){
        const target:{
            name:string,
            key:string}[] = []
        //新的from为该章节
        const newFrom = [...from,item.target.__key]
        item.child.forEach(child => {
            //是章节则递归
            if("child" in child){
                chapterChild(child,newFrom)
            }
            //如果子元素不是章节且被选中，则将其添加到targetKey中并返回
            else{
                if( child.state === false) return;
                //判断其对应的时间是否小于最小时间
                const time = child.target[targetStatus.value]
                if(time < minTime){
                    minTime = time
                }
                target.push({
                    name: child.name,
                    key: child.target.__key
                })
            }
        });
        if(target.length>0){
            chosenList.push({
                sourceKey:newFrom,
                target
            })
        }
    }
}