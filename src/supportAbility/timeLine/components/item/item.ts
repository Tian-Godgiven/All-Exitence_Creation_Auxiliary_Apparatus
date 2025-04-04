import { getExitenceStatusByKey, nowAllExitence } from "@/hooks/all-exitence/allExitence"
import { TimeLine } from "../../timeLine"
import { showAlert } from "@/hooks/alert"
import { getChapterByKey } from "@/hooks/all-articles/allArticles"
import Status from "@/interfaces/Status"
import { showQuickInfo } from "@/api/showQuickInfo"
import { getTimeRule, translateTimeValueEqualToUnit } from "@/supportAbility/customTime/translateTime"
import { TimeRule } from "@/supportAbility/customTime/customTime"

//时间轴的组成部分
export type TimeLineItem = {
    time:number
} & (
//事物类
{
    label:[string,string],//分类名+事物名
    key:{
        typeKey:string,
        exitenceKey:string
    }
}|
//文章类
{
    label:[string,string],//最近章节名+文章名
    key:{
        fromKey:string[],
        articleKey:string
    }, 
}|
//属性类
{
    label:string[],//子属性的名称与值的数组
    key:{
        typeKey:string,//分类
        exitenceKey:string//事物
        statusKey:string//该关联属性
    },
})
//获取时间轴上的对象，以列表形式返回 
export function getTimeLineItems(timeLine:TimeLine){
    //根据类型找到这些对象的容器
    const targetType = timeLine.targetType
    let itemList:TimeLineItem[] = []
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
        return []
    }
    const keyList = timeLine.key
    const itemList:TimeLineItem[] = []
    //遍历keyList，依次获取所有事物
    keyList.forEach(({sourceKey,targetKey}) => {
        const typeKey = sourceKey
        const type = getTimeLineItems_checkType(typeKey)
        if(!type){return null}
        //再寻找type中的targetKey
        targetKey.forEach((item)=>{
            //获取事物
            const exitenceKey = item.exitenceKey
            const statusKey = item.statusKey
            const tmpExitence = type.exitence.find((exitence)=>exitence.__key==exitenceKey)
            if(!tmpExitence){
                return null
            }
            //获取事物的对应属性
            const status = getExitenceStatusByKey(statusKey,tmpExitence.status)
            //存在该属性，并且在该属性如果存在timeRule的话要求timeRule相同
            if(status){
                const exitenceTimeRule = status?.setting?.timeRule
                //如果存在事物属性额外修改了timeRule则要求为同一个timeRule
                if(exitenceTimeRule && exitenceTimeRule != timeLine.timeRuleKey){
                    console.error("事物的对应时间属性已被修改，无法在当前时间轴中生效")
                    return;
                }
                //要求该属性存在且使用相同的时间规则
                itemList.push({
                    label:[type.name,tmpExitence.name],
                    key:{
                        typeKey,
                        exitenceKey,
                    },
                    time:status.value
                })
            }
            
        })
    });
    return itemList
}
//获取文章组成的时间轴物体
function getTimeLineItems_Article(timeLine:TimeLine){
    if(timeLine.targetType != "article")return []
    const keyList = timeLine.key
    const itemList:TimeLineItem[] = [] 
    //遍历key
    keyList.forEach(({sourceKey,targetKey})=>{
        //找到source
        const last = sourceKey.at(-1) ?? null
        const sourceChapter = getChapterByKey(sourceKey,last)
        if(!sourceChapter)return;
        //找到target
        targetKey.forEach((articleKey)=>{
            const tmpArticle = sourceChapter.articles.find((article)=>article.__key==articleKey)
            //加入itemList
            if(!tmpArticle)return;
            itemList.push({
                label:[sourceChapter.name,tmpArticle.title],
                key:{
                    fromKey:tmpArticle.from,
                    articleKey
                },
                time:tmpArticle[timeLine.timeStatusKey]
            })
        })
        
    })
    return itemList
}
//获取事物属性组成的时间轴物体
function getTimeLineItems_Status(timeLine:TimeLine){
    if(timeLine.targetType!="status"){
        console.error("错误传入了timeLine，目标类型不为属性")
        return []
    }
    const keyList = timeLine.key
    const itemList:TimeLineItem[] = [] 
    //获取type的key
    const typeKey = keyList.sourceKey[0]
    const type = getTimeLineItems_checkType(typeKey)
    if(!type){return []}
    //获取exitence
    const exitenceKey = keyList.sourceKey[1]
    const exitence = type.exitence.find((exitence)=>exitence.__key == exitenceKey)
    if(!exitence){return []}
    //获取关联属性
    const relationStatusKey = keyList.targetKey
    const relationStatus = getExitenceStatusByKey(relationStatusKey,exitence.status,type.typeStatus)
    if(!relationStatus){return []}
    //获取指定的时间子属性,以及其他子属性的name和key字典
    const relationSource:Record<string,Status> = relationStatus?.setting["relationSource"]
    let timeStatus:Status|null = null
    const otherStatusLib:Record<string,string> = {}
    for(let status of Object.values(relationSource)){
        if(status.__key == timeLine.timeStatusKey){
            timeStatus = status
        }
        else{
            otherStatusLib[status.__key] = status.name
        }
    }
    if(timeStatus == null)return [];
    //判断该时间子属性使用的timeRule是否一致
    //不一致的情况下使用该时间子属性记录的timeRule
    const timeRule:string = timeStatus.setting["timeRule"]
    checkTimeRuleSame(timeRule,timeLine)
    //获取各个单元的值，剔除上面这个时间子属性
    relationStatus.value.forEach((unitValue:Record<string,any>)=>{
        //记录时间子属性的值
        const timeValue = unitValue[timeStatus.name]
        //记录其他子属性的名称与值
        const otherStatus = []
        for(let key in unitValue){
            const name = otherStatusLib[key]
            const value = unitValue[key]
            otherStatus.push(name+":"+value)
        }
        //添加到itemList
        itemList.push({
            label:otherStatus,
            key:{
                typeKey,
                exitenceKey,
                statusKey:relationStatusKey
            },
            time:timeValue
        })
    })
    return itemList
}

//一个获取type的复用函数
function getTimeLineItems_checkType(typeKey:string){
    console.log(typeKey)
    const type = nowAllExitence.types.find((type)=>type.__key == typeKey)
    if(!type){
        showQuickInfo("未能找到指定的分类，或许您已经将其删除")
        return null
    }
    return type
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

 