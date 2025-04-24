import { ref } from "vue";
import { showPage } from "./pageChange";

//左侧页面当前使用的模式:万物or文章
export const nowLeftPageMode = ref<"all-exitence"|"all-article">("all-exitence")
export function changeLeftPageMode(modeName?:"all-exitence"|"all-article"){
    //取反
    if(!modeName){
        if(nowLeftPageMode.value == "all-article"){
            nowLeftPageMode.value = "all-exitence"
        }
        else{
            nowLeftPageMode.value = "all-article"
        }
        return;
    }
    //设置
    nowLeftPageMode.value = modeName
}

//左侧页面当前是否处于管理模式
export const nowLeftManage = ref<boolean>(false)

//左侧页面聚焦的对象key
const focusTargetKey = ref<string>("")
//聚焦到指定的左侧页面元素
export function focusOnLeftPage(targetKey:string,mode:"all-article"|"all-exitence",showLeft:boolean){
    //显示左侧页面
    if(showLeft){
        showPage("left")
    }
    //切换到指定模式
    changeLeftPageMode(mode)
    //设定聚焦元素为该对象
    focusTargetKey.value = targetKey
}
//获取当前聚焦的对象Key
export function getLeftPageFocusTarget(){
    return focusTargetKey.value
}

//左侧页面滚动目标的div的id
export const scrollTargetId = ref<string>("")
type type = "type"|"group"|"exitence"|"article"|"chapter"
export function scrollToLeftTarget(type:type,key:string){
    //先切换到指定的模式
    if(["type","group","exitence"].includes(type)){
        changeLeftPageMode("all-exitence")
    }
    else{
        changeLeftPageMode("all-article")
    }
    //修改滚动目标的id
    scrollTargetId.value = type+"_"+key
}