import { nowAllExitence } from "@/hooks/all-exitence/allExitence";
import { StatusSetting } from "./statusSettingList";

export const chooseExitenceSettingList:StatusSetting[] = [{
    name:"chooseExitenceNum",
    text:"总最多可选事物数",
    type:"input",
    value:""
},{
    name:"chooseExitenceNumPerType",
    text:"每个分类最多可选事物数",
    type:"input",
    value:""
},{
    name:"chooseFromType",
    text:"仅在指定分类中选择事物",
    type:"choose",
    value:"all",
    choices:()=>{
        //在所有分类中进行选择
        const list = nowAllExitence.types.map(type=>{
            return {
                label:type.name,
                value:type.__key
            }
        })
        //默认选择所有分类
        list.unshift({label:"任意分类",value:"all"})
        return list
    }
},{
    name:"allExitenceInOneLine",
    text:"所有事物在同一行中",
    type:"checkBox",
    value:false
},{
    name:"noLineTitle",
    text:"不显示行标题",
    type:"checkBox",
    value:false
}]