import { SupportAbilitySignUpItem } from "@/data/list/supportAbilityList"
import { showPopUp } from "@/hooks/pages/popUp"
import { reactive, shallowRef } from "vue"
import Manager from "./popUp/Manager.vue"
import { addToRightPage } from "@/hooks/pages/rightPage"

//注册自定义时间表达式
export const customTimeItem:SupportAbilitySignUpItem = {
    "name":"customTime",
    "init":()=>initCustomTime(),
    "call":()=>showCustomTimeManager(),
    "syncProject":(projectPath)=>changeProjectCustomTime(projectPath),
    "save":()=>saveCustomTime()
}

//自定义时间表达式
export type TimeRule = "date"|CustomTimeRule//地球时间
export type CustomTimeRule ={
    name:string,
    numFormat:"阿拉伯数字"|"简体中文数字"|"繁体中文数字",
    units:({
        name:string
        target:string,
        equal:number
    }|{
        name:string
        target:false //最小单位
    })[]
}

//全局时间表达式库
export const globalCustomTime = reactive<CustomTimeRule[]>([])
//项目时间表达式库
export const projectCustomTime = reactive<CustomTimeRule[]>([])

//初始化
function initCustomTime(){
    //加载全局时间表达式

    //注册右侧按钮
    addToRightPage({
        "name":"自定义时间",
        "click":()=>showCustomTimeManager(),
        "iconName":"customTime"
    })
}

//切换项目加载对应项目的事件表达式
function changeProjectCustomTime(projectPath:string){
    const dataPath = projectPath + "data"
}

//保存
function saveCustomTime(){
    //保存到当前项目的时间表达式
}


//创建自定义时间表达式，默认添加到全局中
export function createCustomTimeRule({name,numFormat,units}:CustomTimeRule,position:"global"|"project"="global"){

}

//删除指定的自定义时间表达式

//显示管理页面弹窗
export function showCustomTimeManager(){
    showPopUp({
        vue:shallowRef(Manager),
        buttons:null,
        mask:true
    })
}