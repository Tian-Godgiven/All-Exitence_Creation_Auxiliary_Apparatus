import { Exitence, ExitenceStatus } from "@/class/Exitence"
import Status from "@/interfaces/Status"
import { getExitenceInGroup, getNoGroupExitence, nowAllExitence } from '@/hooks/all-exitence/allExitence';
import { Group } from '@/class/Group';
import { Type } from '@/class/Type';
import { reactive } from "vue";
import { globalCustomTime, projectCustomTime } from "@/supportAbility/customTime/customTime"; 

export type TItem = {
    name:string,
    state:boolean|"mid",
    child:(EItem|GItem)[],
    key:string, //对象的key
    targetStatus:{
        name:string,
        key:string
    },//目标属性的名称和键
    timeStatus:(Status|ExitenceStatus)[],
}
type GItem = {
    name:string,
    state:boolean|"mid",
    child:EItem[],
    key:string
}
export type EItem = {
    name:string,
    state:boolean|"mid",
    key:string, //对象的key
    targetStatus:{
        name:string,
        key:string
    },//目标属性的名称和键
    timeStatus:(Status|ExitenceStatus)[],
}

//获取当前项目可用的所有时间规则组成的选项
export function getTimeRuleList(){
    const allTimeRule = [...globalCustomTime,...projectCustomTime].map(timeRule=>{
        return {
            value:timeRule.__key,
            label:timeRule.name
        }
    })
    //记得添加上最基本的日期
    allTimeRule.unshift({
        value:"date",
        label:"日期"
    })
    return allTimeRule
}
 
//获取需要显示的列表，其中的所有项都具备选择的时间规则的属性
export function getList(timeRuleKey:string):TItem[]{
    //分类列表
    const typeList = nowAllExitence.types
    //遍历分类
    let list:TItem[] = typeList.flatMap((type)=>{
        //获取分类数据
        const typeData = getTypeData(type,timeRuleKey)
        if(!typeData)return[];
        //其中的事物
        const eDataList = typeData.eDataList
        const exitenceList = eDataList.map((value)=>value.target)
        //分组的数据列表
        const groupList = type.groups.flatMap((group)=>{
            const groupData = getGroupData(eDataList,exitenceList,group)
            if(groupData){
                return groupData
            }
            return []
        })
        //没有在分组内的事物数据列表
        const noGroupExitence = getNoGroupExitence(exitenceList,type.groups)
        const noGroupList = getExitenceDataArr(eDataList,noGroupExitence)
        return {
            name: type.name,
            key:type.__key,
            targetStatus:{
                key:typeData.timeStatus[0]?.__key,
                name:typeData.timeStatus[0]?.name
            }, //默认选中第一个属性
            timeStatus:typeData.timeStatus,
            state:false,
            child:[...groupList,...noGroupList]
        }
    })
    return reactive(list)
}

type EData = {
    target:Exitence,
    timeStatus:(Status|ExitenceStatus)[],
}
//获取分类数据：判断一个分类中是否含有具备指定时间规则的事物，若为是则返回分类和对应的事物数组
function getTypeData(type:Type,timeRuleKey:string):{
    timeStatus:Status[],
    eDataList:EData[]
}|false{
    //分类拥有的指定时间规则的时间属性
    let typeTimeStatusList = type.typeStatus.flatMap((status)=>{
        if(status.valueType == "date" && 
            status.setting["timeRule"] == timeRuleKey)
            return status
        return []
    })
    //拥有指定规则的时间属性的事物，及其分别拥有的时间属性
    const exitenceList = type.exitence.flatMap((exitence)=>{
        //遍历事物的属性，获取其中满足条件的时间属性
        const timeStatusList = exitence.status.flatMap((exitenceStatus)=>{
            //如果该属性为分类中的某个满足条件的时间属性
            const tmp = typeTimeStatusList.find(status=>
                status.__key == exitenceStatus.__key
            )
            if(tmp){
                return tmp
            }
            //亦或者这是一个额外属性，且满足条件
            if(exitenceStatus.valueType == "date" &&
                exitenceStatus?.setting?.timeRule == timeRuleKey)
            {
                return exitenceStatus;
            }
            return []
        })
        //若该列表长度大于0，则认为该事物具备时间属性
        if(timeStatusList.length>0){
            return {
                target:exitence,
                timeStatus:timeStatusList,
            }
        }
        return []
    })

    //若拥有时间属性的事物数量大于0，则返回该分类，否则返回false
    if(exitenceList.length>0){
        return {
            timeStatus:typeTimeStatusList,
            eDataList:exitenceList
        }
    }
    return false
}
//获取分组数据
function getGroupData(eDataList:EData[],exitenceList:Exitence[],group:Group):GItem|false{
    //获取分组中的事物
    const eInGroup = getExitenceInGroup(exitenceList,group)
    //没有事物时不返回分组
    if(eInGroup.length<=0)return false
    //获取这些事物在tmp中对应的数据
    const childList = getExitenceDataArr(eDataList,eInGroup)
    //返回分组数据
    return {
        name:group.name,
        state:false,
        child:childList,
        key:group.__key
    }
}
//获取事物数据数组
function getExitenceDataArr(eDataList:EData[],exitenceList:Exitence[]):EItem[]{
    return exitenceList.flatMap((exitence)=>{
        const eData = eDataList.find((value)=>value.target == exitence)
        if(eData) return {
            name:eData.target.name,
            key:eData.target.__key,
            timeStatus:eData.timeStatus,
            targetStatus:{
                name:"",
                key:""
            },
            state:false,
        }
        return []
    })
}

//获取列表中选择的事物对象与属性的信息
export type TargetList = {
    name:string,
    key:string,
    status?:{
        name:string,
        key:string
    },
    exitence:ExitenceItem[]
}[]
type ExitenceItem = {
    name:string,
    key:string
    status:{
        name:string,
        key:string
    },
}
export function getSelectionExitence(list: TItem[]) {
    const targetList:TargetList = []
    // 遍历列表
    list.forEach(type => {
        if (!type.child) return;  // 如果没有子元素，跳过
        const { state: typeState, targetStatus: statusOfType } = type;
        if (typeState===false)return;
        // 该分类下的事物列表
        const exitenceList:{ name:string,key:string,status:{name:string,key:string}}[] = []
        // 分类中存在选中对象的情况
        type.child.forEach(child =>{
            if (child.state === false) return;
            //分组
            if ('child' in child) {
                child.child.forEach(exitence => {
                    if (exitence.state === true) {
                        addExitenceToList(exitence, exitenceList,statusOfType);
                    }
                });
            }
            //事物 
            else {
                addExitenceToList(child, exitenceList,statusOfType);
            }
        });
        targetList.push({
            name:type.name,
            key:type.key,
            status:{
                name:type.targetStatus.name,
                key:type.targetStatus.key
            },
            exitence:exitenceList
        })
    });
    return targetList
 
    // 添加选中的事物到列表中
    function addExitenceToList(eItem: EItem, list:ExitenceItem[],statusOfType?: TItem["targetStatus"],) {
        let targetStatus 
        if(eItem.targetStatus?.key == "" || eItem.targetStatus.key == "inherit"){
            targetStatus = statusOfType
        }
        else{
            targetStatus = eItem.targetStatus
        }
        if(!targetStatus){
            console.error("意料之外的错误：该事物没有被正确设置时间属性")
            return;
        }

        list.push({
            name:eItem.name,
            key: eItem.key,
            status:{
                name:targetStatus.name,
                key:targetStatus.key
            }
        });
    }
}
