import { SupportAbilitySignUpItem } from "@/static/list/supportAbilityList";
import TimeLineVue from "./TimeLine.vue";
import { showPopUp } from "@/hooks/pages/popUp";
import { reactive, shallowRef, toRaw } from "vue";
import { tryReadFileAtPath, writeFileAtPath } from "@/hooks/fileSysytem";
import { addToRightPage } from "@/hooks/pages/rightPage";
import { nowProjectInfo } from "@/hooks/project/projectData";
import { getTimeRuleUnits, translateTimeArrToValue, translateTimeUnitValueToValue, translateTimeValueEqualToUnit, translateTimeValueToArr, translateTimeValueToCarryover } from "../customTime/translateTime";
import { TimeRule } from "../customTime/customTime";
import { showAlert } from "@/hooks/alert";
import { isString } from "lodash";
import { el } from "date-fns/locale";

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
    name:string,
    targetType: "status"|"exitence"|"article",
    timeRuleKey: "date" | string;  // 时间线规则的key，"date" 或其他值
    setting:{
        now:number|null, //当前时间,默认为最小时间
        start:number|null, //起始时间，默认为最小时间
    },
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
export function showTimeLinePopUp(){
    showPopUp({
        vue:shallowRef(TimeLineVue),
        "buttons":null,
        "mask":true
    })
}



//创建新的时间轴
export function createTimeLine(timeLine:TimeLine){
    //向当前的总时间轴对象中添加该时间轴
    nowAllTimeLine.push(timeLine)
}
//编辑/更新时间轴
export function editTimeLine(timeLine:TimeLine,newTimeLine:TimeLine){
    const index = nowAllTimeLine.indexOf(timeLine)
    if(index>=0){
        nowAllTimeLine[index] = newTimeLine
    }
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


/** 工具函数 */

//接受时间轴上的某个刻度的值，计算出该刻度的单位和文本
export function getTickInfo(scaleValue:number,rule:TimeRule,unitEnd?:string,start:boolean=false){
    if(!rule)return {
        height:5,
        width:1,
    };
    //scale的值是相较于最小单位的，因此需要进行一道转化
    let value = scaleValue
    if(unitEnd){
        //获取其完整值
        const tmp = translateTimeUnitValueToValue(scaleValue,unitEnd,rule)
        if(tmp){
            value = tmp
        }
    }

    //获取刻度值文本
    let textArr
    //如果是起始刻度
    if(start){
        //获取该刻度值相较于最小单位的所有值
        textArr = translateTimeValueToArr({
            value,
            rule,
            unitEnd
        })
    }
    else{
        //获取该刻度值相较于最小单位的进位
        textArr = translateTimeValueToCarryover({
            value,
            rule,
            unitEnd
        })
    }

    //刻度文本为各个单位的值和名称
    const text = textArr.map(unit=>{
        return unit.value.toString() + unit.name
    })

    //进位越多刻度越长
    const length = textArr.length
    return {
        height:5+2*length,
        width:1+0.5*length,
        text:text.length>0?text:null
    }
}

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

//获取指定时间规则中更大或更小的一个单位，但不会是最大单位
export function getBiggerUnit(timeRule:TimeRule,nowUnit?:string){
    const unitList = getTimeRuleUnits(timeRule)
    
    let biggerIndex:number
    //如果没有单位，则认为是最小单位，返回上一级单位
    if(!nowUnit){
        biggerIndex = unitList.length-1
    }
    else{
        //获取当前位置
        const nowIndex = unitList.findIndex((unit)=>{
            if(isString(unit)){
                return unit == nowUnit;
            }
            else{
                return unit.name == nowUnit
            }
        })
        //上一级单位的index
        biggerIndex = nowIndex-1
    }
    //要求不会是最大单位
    if(biggerIndex <= 0){
        return false
    }
    let biggerUnit:any = unitList[biggerIndex]
    if(!isString(biggerUnit)){
        biggerUnit = biggerUnit.name
    }
    return biggerUnit as string
}

export function getSmallerUnit(timeRule:TimeRule,nowUnit?:string){
    const unitList = getTimeRuleUnits(timeRule)
    
    let smallerIndex:number
    //如果没有单位，则认为是最小单位，返回false
    if(!nowUnit){
        return false
    }
    //获取当前位置
    const nowIndex = unitList.findIndex((unit)=>{
        if(isString(unit)){
            return unit == nowUnit;
        }
        else{
            return unit.name == nowUnit
        }
    })
    //下一级单位的index
    smallerIndex = nowIndex+1
    
    //要求不会越界
    if(smallerIndex >= unitList.length){
        return false
    }
    let smallerUnit:any = unitList[smallerIndex]
    if(!isString(smallerUnit)){
        smallerUnit = smallerUnit.name
    }
    return smallerUnit as string
}


