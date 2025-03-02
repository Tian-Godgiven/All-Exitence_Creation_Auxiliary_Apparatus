import { SupportAbilitySignUpItem } from "@/data/list/supportAbilityList";
import TimeLineVue from "./popUp/TimeLine.vue";
import CreateTimeLineVue from "./popUp/CreateTimeLine.vue";
import { showPopUp } from "@/hooks/pages/popUp";
import { reactive, shallowRef, toRaw } from "vue";
import { tryReadFileAtPath, writeFileAtPath } from "@/hooks/fileSysytem";
import { addToRightPage } from "@/hooks/pages/rightPage";
import { nowProjectInfo } from "@/hooks/project/projectData";
import { Exitence } from "@/class/Exitence";
import { Article } from "@/class/Article";
import { getExitenceStatusByKey, nowAllExitence } from "@/hooks/all-exitence/allExitence";
import Status from "@/interfaces/exitenceStatus";
import { showAlert } from "@/hooks/alert";
import { cloneDeep } from "lodash";
import { getChapterByKey} from "@/hooks/all-articles/allArticles";

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
        sourceKey:[string], //其所在的分类的key
        targetKey:string[],//该分类下的所有事物的key
    }[],
	timeStatusKey:string|null,//该时间线所使用的时间属性的key
	timeRuleKey:string|"date",//该时间线所使用的时间规则的key
	now:number|null,//该时间线当前所处的位置，默认从最早的一个对象开始
	unitStart?:string,//该时间线当前所显示的最大单位
	unitEnd?:string,//该时间线当前所显示的最小单位
}|
//对于文章类型,其具备其他限制
{
    targetType:"article",
    key:{
        sourceKey:string[], //文章对象的from值
        targetKey:string[],//相同from值的文章对象的key值
    }[],
	timeStatusKey:"createTime"|"updateTime",//要么是创建时间，要么时上次编辑时间
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
    switch(targetType){
        case "exitence":
            itemList = getTimeLineItems_Exitence(timeLine)
            break;
        case "article":
            itemList = getTimeLineItems_Article(timeLine)
            break;
        case "status":
            itemList = getTimeLineItems_Status(timeLine)
            break;
        default:
            console.error("不支持的时间线目标类型")
            break;
    }
    return itemList
}
//获取事物组成的时间轴物体
function getTimeLineItems_Exitence(timeLine:TimeLine){
    if(timeLine.targetType!="exitence"){
        console.error("错误传入了timeLine，目标类型不为事物")
        return null
    }
    const keyList = timeLine.key
    const itemList:TimeLineItem[] = []
    //遍历keyList，依次获取所有事物
    keyList.forEach(({sourceKey,targetKey}) => {
        const typeKey = sourceKey[0]
        const type = getTimeLineItems_checkType(typeKey,timeLine)
        if(!type){return null}
        //再寻找type中的targetKey
        targetKey.forEach((exitenceKey)=>{
            const tmpExitence = type.exitence.find((exitence)=>exitence.__key==exitenceKey)
            if(tmpExitence){
                //获取事物组成的item
                const tmpItem = getTimeLineItems_checkExitence(tmpExitence,timeLine)
                if(tmpItem){
                    itemList.push(tmpItem)
                }
            }
        })
    });
    return itemList
}
//获取事物属性组成的时间轴物体
function getTimeLineItems_Status(timeLine:TimeLine){
    if(timeLine.targetType!="status"){
        console.error("错误传入了timeLine，目标类型不为属性")
        return null
    }
    const keyList = timeLine.key
    const itemList:TimeLineItem[] = [] 
    //获取type的key
    const typeKey = keyList.sourceKey[0]
    const type = getTimeLineItems_checkType(typeKey,timeLine)
    if(!type){return null}
    //获取exitence
    const exitenceKey = keyList.sourceKey[1]
    const exitence = type.exitence.find((exitence)=>exitence.__key == exitenceKey)
    if(!exitence){return null}
    //获取关联属性
    const relationStatus:Status = getExitenceStatusByKey(keyList.targetKey,exitence.status,type.typeStatus)
    if(!relationStatus){return null}
    //获取指定的时间子属性
    const relationSource:Record<string,Status> = relationStatus?.setting["relationSource"]
    const timeStatus = Object.values(relationSource)?.find((status)=>
        status.__key== timeLine.timeStatusKey
    )
    if(!timeStatus){return null}
    //判断该时间子属性使用的timeRule是否一致
    //不一致的情况下使用该时间子属性记录的timeRule
    checkTimeRuleSame(timeStatus?.setting["timeRule"],timeLine)
    //获取各个单元的值，剔除上面这个时间子属性
    const unitValueList = relationStatus.value
    unitValueList.forEach((unitValue:Record<string,any>)=>{
        //深拷贝一份
        const tmp = cloneDeep(unitValue)
        //记录时间子属性的值
        const timeValue = tmp[timeStatus.name]
        //剔除时间子属性的键值对
        delete tmp[timeStatus.name]
        //添加到itemList
        itemList.push({item:tmp,time:timeValue})
    })
    return itemList
}
//获取文章组成的时间轴物体
function getTimeLineItems_Article(timeLine:TimeLine){
    if(timeLine.targetType != "article")return null
    const keyList = timeLine.key
    const itemList:TimeLineItem[] = [] 
    //遍历key
    keyList.forEach(({sourceKey,targetKey})=>{
        //找到source
        const last = sourceKey.at(-1) ?? null
        const source = getChapterByKey(sourceKey,last)
        if(source){
            //找到target
            targetKey.forEach((articleKey)=>{
                const tmpArticle = source.articles.find((article)=>article.__key==articleKey)
                //加入itemList
                if(tmpArticle){
                    itemList.push({
                        item:tmpArticle,
                        time:tmpArticle[timeLine.timeStatusKey]
                    })
                }
            })
        }
    })
    return itemList
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
    checkTimeRuleSame(timeStatus?.setting["timeRule"],timeLine)
    return type
}
//检查事物是否具备指定属性，并且时间规则是否相同的函数，返回满足条件的exitence组成的TimeLineItem
function getTimeLineItems_checkExitence(exitence:Exitence,timeLine:TimeLine){
    const timeStatusKey = timeLine.timeStatusKey
    const status = getExitenceStatusByKey(timeStatusKey,exitence.status)
    if(status && status?.setting["timeRule"] == timeLine.timeRuleKey){
        return {item:exitence,time:status.value}
    }
    return false
}
//检查时间规则是否一致，不一致的情况下改用前者的时间规则
function checkTimeRuleSame(timeRuleKey:string,timeLine:TimeLine){
    if(timeRuleKey != timeLine.timeRuleKey){
        //弹出提示，并且修改时间轴记录的时间规则
        showAlert({
            info:"时间属性所使用的时间规则出现变动，已自动调整为新的时间规则",
            confirm:()=>{}
        })
        timeLine.timeRuleKey = timeRuleKey
    }
}

