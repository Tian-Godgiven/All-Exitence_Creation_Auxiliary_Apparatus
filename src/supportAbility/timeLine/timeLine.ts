import { SupportAbilitySignUpItem } from "@/static/list/supportAbilityList";
import TimeLineVue from "./TimeLine.vue";
import CreateTimeLineVue from "./popUp/CreateTimeLine/CreateTimeLine.vue";
import { showPopUp } from "@/hooks/pages/popUp";
import { reactive, shallowRef, toRaw } from "vue";
import { tryReadFileAtPath, writeFileAtPath } from "@/hooks/fileSysytem";
import { addToRightPage } from "@/hooks/pages/rightPage";
import { nowProjectInfo } from "@/hooks/project/projectData";
import { translateTimeArrToValue, translateTimeValueToCarryover } from "../customTime/translateTime";
import { TimeRule } from "../customTime/customTime";

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
	targetType:"exitence",//时间线目标的类型
    key:{
        sourceKey:string, //其所在的分类的key
        targetKey:{
            exitenceKey:string,//该分类下的所有选中的事物的key
            statusKey:string //对应事物所使用的时间属性的key
        }[],
    }[],
	timeRuleKey:string|"date",//该时间线所使用的时间规则的key
	now:number|null,//该时间线当前所处的位置，默认从最早的一个对象开始
	unitStart?:string,//该时间线当前所显示的最大单位
	unitEnd?:string,//该时间线当前所显示的最小单位
}|
//文章类型
{
    targetType:"article",
    key:{
        sourceKey:string[], //文章对象的from值
        targetKey:string[],//相同from值的文章对象的key值
    }[],
	timeStatus:"createTime"|"updateTime",//要么是创建时间，要么时上次编辑时间
	timeRuleKey:"date",//该时间线所使用的时间规则的key
	now:number|null,//该时间线当前所处的位置，默认从最早的一个对象开始
	unitStart?:string,//该时间线当前所显示的最大单位
	unitEnd?:string,//该时间线当前所显示的最小单位
}|
//属性类型
{
    targetType:"status",//时间线目标的类型
    key:{
        sourceKey:[string,string], //其所在的分类的key+其所在的事物的key
        targetKey:string,//其本身的key
    },
	timeStatusKey:string|null,//该时间线所使用的时间属性的key
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

//接受时间轴上的某个刻度的值，计算出该刻度的单位和文本
export function getScaleInfo(scaleValue:number,rule:TimeRule,unitEnd?:string){
    if(!rule)return {
        height:5,
        width:1,
    };
    //scale的值是相较于最小单位的，因此需要进行一道转化
    if(unitEnd){
        //设其为该值的时间单位数组
        const timeArr = [
            {  
                name:unitEnd,
                value:scaleValue
            }
        ]
        //获取其真实值
        const tmp = translateTimeArrToValue(timeArr,rule)
        console.log(tmp)
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



