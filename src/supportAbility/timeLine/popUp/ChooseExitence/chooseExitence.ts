import { ExitenceStatus } from "@/class/Exitence"
import Status from "@/interfaces/Status"
import { nowAllExitence } from '@/hooks/all-exitence/allExitence';
import { customTimeLib } from "@/supportAbility/customTime/customTime"; 
import { ExitenceDataInTree, getChooseExitenceListInTreeList, TypeDataInTree } from "@/components/other/chooseExitenceInTree/chooseExitenceInTree";

//树列表中的结构
export type TItem = TypeDataInTree<ExitenceData,{},TypeData>
export type EItem = ExitenceDataInTree<ExitenceData>

//获取当前项目可用的所有时间规则组成的选项
export function getTimeRuleList(){
    const allTimeRule = customTimeLib.map(timeRule=>{
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

export type TypeData = {
    targetStatus:{
        name:string,
        key:string,
        time:number
    },//选中的属性的名称,键和值
    timeStatus:(Status|ExitenceStatus)[],
}
export type ExitenceData = {
    targetStatus:{
        name:string,
        key:string,
        time:number
    },//选中的目标时间属性的名称和键和值
    timeStatus:(Status|ExitenceStatus)[],
}
//获取选择事物列表树中使用的表格
export function getList(timeRuleKey:string){
    return getChooseExitenceListInTreeList<TypeData,ExitenceData,{}>({
        typeList:nowAllExitence.types,
        ifGroup:true,
        getTypeData:(type)=>{
            //分类拥有的指定时间规则的时间属性
            const typeTimeStatus = type.typeStatus.flatMap((status)=>{
                if(status.valueType == "date" && 
                    status.setting["timeRule"] == timeRuleKey)
                    return status
                return []
            })
            if(!typeTimeStatus)return false;
            return {
                targetStatus:{
                    key:typeTimeStatus[0]?.__key,
                    name:typeTimeStatus[0]?.name,
                    time:typeTimeStatus[0]?.value
                }, //默认选中第一个属性
                timeStatus:typeTimeStatus,
            }
        },
        getGroupData:()=>{
            return {}
        },
        //要求事物具备满足条件的时间属性
        getExitenceData:(_type,typeData,exitence)=>{
            //遍历事物的属性，获取其中满足条件的时间属性
            const timeStatusList = exitence.status.flatMap((exitenceStatus)=>{
                //如果该属性为分类中的某个满足条件的时间属性
                const tmp = typeData.timeStatus.find(status=>
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
            //若该列表长度大于0，则认为该事物具备时间属性，允许被选择
            if(timeStatusList.length>0){
                return {
                    timeStatus:timeStatusList,
                    targetStatus:{
                        name:"",
                        key:"",
                        time:0
                    },
                }
            }
            return false
        }
    })
}

//最终返回的目标列表，包含对象名称和key，各个事物对象还包含对应的时间值
export type TargetList = TypeItem[]
type TypeItem = {
    name:string,//type的名称和key，以及选择的type的时间属性的信息
    key:string,
    status?:{
        name:string,
        key:string
    },
    exitence:ExitenceItem[]
}
type ExitenceItem = {
    name:string,
    key:string,
    status:{
        name:string,
        key:string
    },
}
//获取选择的列表与最小时间值
export function getSelectionExitence(list: TItem[]) {
    const targetList:TargetList = []
    //最小时间值
    let minTimeValue = Infinity
    // 遍历列表
    list.forEach(type => {
        if (!type.child) return;  // 如果没有子元素，跳过
        const { state: typeState, targetStatus: statusOfType } = type;
        if (typeState===false)return;
        // 该分类下的事物列表
        const exitenceList:ExitenceItem[] = []
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
    return {targetList,minTimeValue}
 
    // 添加选中的事物到列表中
    function addExitenceToList(eItem: EItem, list:ExitenceItem[],statusOfType?: TItem["targetStatus"],) {
        let targetStatus 
        //继承分类 
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
        //判断这个事物的时间值是否小于当前最小时间
        if(targetStatus.time < minTimeValue){
            minTimeValue = targetStatus.time
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
