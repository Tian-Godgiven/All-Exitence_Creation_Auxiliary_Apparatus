import { Article } from "@/class/Article"
import { Exitence } from "@/class/Exitence"
import { reactive, ref } from "vue"

//当前显示在主页面中的对象
export const showOnMain:any = reactive({
    target:{
        title:"",
        inner:"测试内容".repeat(250),
    },
    type:'article'
}) 
//当前显示模式
export const showTargetType = ref<"exitence" | "article">("article")
// 显示事物在主页面
export function showExitenceOnMain(exitence:Exitence){
    showOnMain.target = reactive(exitence)
    showOnMain.type = 'exitence'
}
// 显示文章
export function showArticle(article:Article){
    showOnMain.target = reactive(article)
    showOnMain.type = 'article'
}