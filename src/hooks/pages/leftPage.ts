import { ref } from "vue";

//左侧页面当前使用的模式
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