import { Exitence } from "@/class/Exitence"
import { reactive, ref } from "vue"

//当前显示在主页面中的对象
export const showTarget:any = reactive({
    target:{
        title:"",
        inner:"",
    },
    type:'article'
}) 
//当前显示模式
export const showTargetType = ref<"exitence" | "article">("article")
// 点击将事物显示在主页面
export function showExitenceOnMain(exitence:Exitence){
    showTarget.target = reactive(exitence)
    showTarget.target.name = exitence.name
    showTarget.type = 'exitence'
}