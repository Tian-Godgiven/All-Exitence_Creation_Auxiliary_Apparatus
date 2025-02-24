import { SupportAbilitySignUpItem } from "@/data/list/supportAbilityList";
import TimeLineVue from "./popUp/TimeLine.vue";
import CreateTimeLineVue from "./popUp/CreateTimeLine.vue";
import { showPopUp } from "@/hooks/pages/popUp";
import { reactive, shallowReactive, shallowRef, toRaw } from "vue";
import { tryReadFileAtPath, writeFileAtPath } from "@/hooks/fileSysytem";
import { addToRightPage } from "@/hooks/pages/rightPage";
import { nowProjectInfo } from "@/hooks/project/projectData";
import { Exitence } from "@/class/Exitence";
import { Article } from "@/class/Article";
import { Type } from "@/class/Type";
import { Group } from "@/class/Group";
import { getExitenceInGroup, getExitenceStatusByKey, nowAllExitence } from "@/hooks/all-exitence/allExitence";
import Status from "@/interfaces/exitenceStatus";
import { showAlert } from "@/hooks/alert";

//注册辅助功能对象
export const timeLineSignUpItem:SupportAbilitySignUpItem={
    name:"timeLine",
    "init":initTimeLine,
    "save":saveTimeLine,
    "call":showTimeLinePopUp,
    "syncProject":(projectPathName)=>{
        changeTimeLine(projectPathName)
    }
}

/**
 * 时间轴对象
 */
export type TimeLine = {
	targetType:"type"|"group"|"exitence"|"article",//时间线目标的类型
	targetKey:string[],//最后一个元素为目标的key，如果是exitence和article则还会包含其来源的key
	timeStatusKey:string|null,//该时间线所使用的时间属性的key，对article为null
	timeRuleKey:string|"date",//该时间线所使用的时间规则的key
	now:number|null,//该时间线当前所处的位置，默认从最早的一个对象开始
	unitStart?:string,//该时间线当前所显示的最大单位
	unitEnd?:string,//该时间线当前所显示的最小单位
}

//默认的总时间轴对象
const idleAllTimeLine:TimeLine[] = []
//当前总时间轴
export const nowAllTimeLine = reactive<TimeLine[]>([])


//初始化:添加按键即可
function initTimeLine(){
    addToRightPage({
        "name":"时间轴",
        "click":()=>showTimeLinePopUp(),
        "iconName":"timeLine"
    })
}
//保存
function saveTimeLine(){
    const dataPath = "projects/"+nowProjectInfo.pathName+"/data"
    writeFileAtPath(dataPath,"timeLine.json",toRaw(nowAllTimeLine))
}
//改变项目
async function changeTimeLine(projectPath:string){
    const dataPath = projectPath+"/data"
    //尝试读取项目时间线，失败时创建默认总时间线对象
    let tmp:TimeLine[] = await tryReadFileAtPath(
        dataPath,"timeLine.json",true,idleAllTimeLine)
    //切换当前总时间线
    nowAllTimeLine.length = 0 //清空数组内容
    Object.assign(nowAllTimeLine,tmp)
}

//显示时间线弹窗
function showTimeLinePopUp(){
    showPopUp({
        vue:shallowRef(TimeLineVue),
        "buttons":null,
        "mask":true
    })
}

//显示创建时间轴弹窗
export function showCreateTimeLinePopUp(){
    showPopUp({
        vue:shallowRef(CreateTimeLineVue),
        "buttons":[],
        "mask":true,
        returnValue:(newTimeLine:TimeLine)=>{
            createTimeLine(newTimeLine)
        }
    })
}

//创建新的时间轴
export function createTimeLine(timeLine:TimeLine){
    //向当前的总时间轴对象中添加该时间轴
    nowAllTimeLine.push(timeLine)
}

//获取时间轴上的对象，以列表形式返回
type TimeLineItem = {
    item:Exitence|Article|any,
    time:number
}
export function getTimeLineItems(timeLine:TimeLine){
    //根据类型找到这些对象的容器
    const targetType = timeLine.targetType
    let itemList:TimeLineItem[] | null = []
    let container:Type|Exitence|Group|Article|null = null
    switch(targetType){
        case "type":
            itemList = getTimeLineItemsFromType(timeLine)
            break;
        case "group":
            itemList = getTimeLineItemsFromGroup(timeLine)
            break;
        case "exitence":
            itemList = getTimeLineItemsFromExitence(timeLine)

    }
}
//从分类中获取时间轴物体
function getTimeLineItemsFromType(timeLine:TimeLine){
    const keyList = timeLine.targetKey
    //在当前项目的所有分类中寻找
    const typeKey = keyList[0]
    const type = getTimeLineItems_checkType(typeKey,timeLine)
    if(!type){return null}
    //遍历所有事物，要求具备该时间属性，并且使用的时间规则相同
    const itemList:TimeLineItem[] = getTimeLineItems_checkExitence(type.exitence,timeLine)
    return itemList
}
//获取分组中的时间轴物体
function getTimeLineItemsFromGroup(timeLine:TimeLine){
    const keyList = timeLine.targetKey
    //在当前项目的所有分类中寻找group所在的分类
    const typeKey = keyList[0]
    const type = getTimeLineItems_checkType(typeKey,timeLine)
    if(!type){return null}
    //获取group
    const group = type.groups.find((group)=>group.__key == keyList[1])
    if(!group){return null}
    //获取应当处于该group中的exitence
    const exitenceList = getExitenceInGroup(type,group)
    //再获取itemList
    const itemList = getTimeLineItems_checkExitence(exitenceList,timeLine)
    return itemList
}
//获取事物中的关联属性组成时间轴物体
function getTimeLineItemsFromExitence(timeLine:TimeLine){
    const keyList = timeLine.targetKey
    //获取type
    const typeKey = keyList[0]
    const type = getTimeLineItems_checkType(typeKey,timeLine)
    if(!type){return null}
    //获取exitence
    const exitence = type.exitence.find((exitence)=>exitence.__key == keyList[1])
    if(!exitence){return null}
    //获取属性
    const status = getExitenceStatusByKey(keyList[2],exitence.status,type.typeStatus)
    if(!status){return null}
    //获取关联属性
    const relationSource = status?.setting["relationSource"][timeLine.timeStatusKey]
    
}
//一个获取type并检查其指定属性的时间规则的复用函数
function getTimeLineItems_checkType(typeKey:string,timeLine:TimeLine){
    const type = nowAllExitence.types.find((type)=>type.__key == typeKey)
    if(!type){
        showAlert({
            info:"未能找到指定的分类，或许您已经将其删除",
            confirm:()=>{}
        })
        return null
    }
    //然后寻找对应的事物对象key以及相应的时间属性的值
    const timeStatus = type.typeStatus.find((status:Status)=>status.__key == timeLine.timeStatusKey)
    if(!timeStatus){
        showAlert({
            info:"未能找到指定的属性，或许您已经将其删除",
            confirm:()=>{}
        })
        return null
    }
    //要求指定的时间属性值对应的时间规则与时间轴上记录的时间规则一致
    if(timeStatus?.setting["timeRule"] != timeLine.timeRuleKey){
        //弹出提示，并且修改时间轴记录的时间规则
        showAlert({
            info:"时间属性所使用的时间规则出现变动，已自动调整为新的时间规则",
            confirm:()=>{}
        })
        timeLine.timeRuleKey = timeStatus?.setting["timeRule"]
    }
    return type
}
//一个遍历事物并检查其具备指定属性，并且时间规则相同的复用函数，返回满足条件的exitence的结果组成的itemList
function getTimeLineItems_checkExitence(exitenceList:Exitence[],timeLine:TimeLine){
    const itemList:TimeLineItem[] = []
    const timeStatusKey = timeLine.timeStatusKey
    exitenceList.forEach((exitence)=>{
        const status = getExitenceStatusByKey(timeStatusKey,exitence.status)
        if(status && status?.setting["timeRule"] == timeLine.timeRuleKey){
            itemList.push({item:exitence,time:status.value})
        }
    })
    return itemList
}

