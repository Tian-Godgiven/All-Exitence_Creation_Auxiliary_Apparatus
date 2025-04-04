import { SupportAbilitySignUpItem } from "@/static/list/supportAbilityList";
import TimeLineVue from "./TimeLine.vue";
import { showPopUp } from "@/hooks/pages/popUp";
import { reactive, ref, shallowRef, toRaw } from "vue";
import { tryReadFileAtPath, writeFileAtPath } from "@/hooks/fileSysytem";
import { addToRightPage } from "@/hooks/pages/rightPage";
import { nowProjectInfo } from "@/hooks/project/projectData";
import { translateTimeArrToValue, translateTimeUnitValueToValue, translateTimeValueEqualToUnit, translateTimeValueToArr, translateTimeValueToCarryover } from "../customTime/translateTime";
import { TimeRule } from "../customTime/customTime";
import { showAlert } from "@/hooks/alert";
import { TimeLineItem } from "./components/item/item";

//注册辅助功能对象
export const timeLineSignUpItem:SupportAbilitySignUpItem={
    name:"timeLine",
    "init":initTimeLine,
    "save":saveTimeLine,
    "call":showTimeLinePopUp,
    "syncProject":async (projectPathName)=>{
        changeTimeLine(projectPathName)
    }
}

/**
 * 时间轴类型
 */
// 通用时间线属性（共有的部分）
type TimeLineBase = {
    targetType: "status"|"exitence"|"article",
    timeRuleKey: "date" | string;  // 时间线规则的key，"date" 或其他值
    now: number | null;  // 当前时间线的位置，默认从最早的对象开始
    unitStart?: string;  // 当前时间线的最大单位
    unitEnd?: string;    // 当前时间线的最小单位
};
// 事件类型时间线
export type ExistenceTimeLine = TimeLineBase & {
    targetType: "exitence";  // 明确指定目标类型为 "exitence"
    key: {
        sourceKey: string;  // 分类的key
        targetKey: {
            exitenceKey: string;  // 该分类下选中的事物的key
            statusKey: string;    // 事物对应的时间属性的key
        }[];
    }[];
    timeStatusKey:"",
};
// 文章类型时间线
export type ArticleTimeLine = TimeLineBase & {
    targetType: "article";  // 明确指定目标类型为 "article"
    key: {
        sourceKey: string[];  // 文章对象的from值
        targetKey: string[];  // 相同from值的文章对象的key值
    }[];
    // 创建时间，默认为编辑时间
    timeStatusKey: "createTime" | "updateTime";  
};
  
// 属性类型时间线
export type StatusTimeLine = TimeLineBase & {
    targetType: "status";  // 明确指定目标类型为 "status"
    key: {
        sourceKey: [string, string];  // 分类的key + 事物的key
        targetKey: string;            // 该时间线本身的key
    };
    timeStatusKey: string;  // 时间属性的key，可能为null
};
  
// 时间线类型联合
export type TimeLine = ExistenceTimeLine | ArticleTimeLine | StatusTimeLine;

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
//切换项目
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
export const ifShowCreatePage = ref(false)
export function showCreateTimeLine(){
    showTimeLinePopUp()
    //切换到创建时间轴页面
    ifShowCreatePage.value = true
}
export function hideCreateTimeLine(){
    //切换走创建时间轴页面
    ifShowCreatePage.value = false
}

//创建新的时间轴
export function createTimeLine(timeLine:TimeLine){
    //向当前的总时间轴对象中添加该时间轴
    nowAllTimeLine.push(timeLine)
}
//编辑
export function editTimeLine(timeLine:TimeLine){

}

//删除
export function deleteTimeLine(timeLine:TimeLine){
    showAlert({
        info:"确认删除该时间线？",
        confirm:()=>{
            const index = nowAllTimeLine.indexOf(timeLine)
            if(index > -1){
                nowAllTimeLine.splice(index,1)
            }
        }
    })
}

//接受时间轴上的某个刻度的值，计算出该刻度的单位和文本
export function getTickInfo(scaleValue:number,rule:TimeRule,unitEnd?:string){
    if(!rule)return {
        height:5,
        width:1,
    };
    //scale的值是相较于最小单位的，因此需要进行一道转化
    if(unitEnd){
        //获取其完整值
        const tmp = translateTimeUnitValueToValue(scaleValue,unitEnd,rule)
        if(tmp)scaleValue = tmp
    }
    //获取该刻度值相较于最小单位的进位
    const carryoverArr = translateTimeValueToCarryover({
        value:scaleValue,
        rule,
        unitEnd
    })
    //刻度文本为进位的值和名称
    const text = carryoverArr.map(unit=>{
        return unit.value.toString() + unit.name
    })
    //进位越多刻度越长
    const carryoverNum = carryoverArr.length
    return {
        height:5+2*carryoverNum,
        width:1+0.5*carryoverNum,
        text
    }
}
//接受时间轴的第一个刻度的值，计算出刻度的单位和文本
export function getStartTickInfo(scaleValue:number,rule:TimeRule,unitEnd?:string){
    if(!rule)return {
        height:5,
        width:1,
    };
    //scale的值是相较于最小单位的，因此需要进行一道转化
    if(unitEnd){
        //获取其完整值
        const tmp = translateTimeUnitValueToValue(scaleValue,unitEnd,rule)
        if(tmp){
            scaleValue = tmp
        }
    }
    //获取该刻度值相较于最小单位的值
    const timeArr = translateTimeValueToArr({
        value:scaleValue,
        rule,
        unitEnd
    })
    //刻度文本为各个单位的值和名称
    const text = timeArr.map(unit=>{
        return unit.value.toString() + unit.name
    })
    //进位越多刻度越长
    const carryoverNum = timeArr.length
    return {
        height:5+2*carryoverNum,
        width:1+0.5*carryoverNum,
        text
    }
}

//获取一个时间值将指定单位设定为1时的完整时间值

//获取一个时间值，将指定最小单位设定为最小值时的时间值，用于生成第一个刻度
export function getSmallestTime(timeValue:number,rule:TimeRule,unitEnd?:string){
    const timeArr = translateTimeValueToArr({
        value:timeValue,
        rule,
        unitEnd
    })
    //设定其中最小单位的值为1
    const smallUnit = timeArr.at(-1)
    if(!smallUnit)return 0
    smallUnit.value = 1
    //然后获得这个数组转换回值
    const smallValue = translateTimeArrToValue(timeArr,rule)
    //再获得这个值相较于最小单位的值
    if(smallValue===false)return 0;
    return smallValue
}

// 计算时间轴上任意一个时间的位置(相较于起始位置的left，单位px）
// 注意这个时间必须是完整时间
export function getTimeLocation(time:number,timeRule:TimeRule|false,startTime:number,pxPerUnit:number,minUnit?:string,){
    if(!timeRule)return;
    //这个差值等于多少最小单位,包含2为小数
    const timeValue = translateTimeValueEqualToUnit(time,timeRule,minUnit,true)
    const startValue = translateTimeValueEqualToUnit(startTime,timeRule,minUnit)
    //获取该对象的时间值相较于开始时间的差值
    const distantValue = Number((timeValue - startValue).toFixed(2))
    //乘以最小单位等于多少px
    const x = distantValue * pxPerUnit
    return x
}



