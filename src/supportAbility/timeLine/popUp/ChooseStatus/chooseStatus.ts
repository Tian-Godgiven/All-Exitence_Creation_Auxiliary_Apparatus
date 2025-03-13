import { Exitence, ExitenceStatus } from "@/class/Exitence";
import { Group } from "@/class/Group";
import { Type } from "@/class/Type";
import { getExitenceInGroup, getExitenceStatusByKey, getNoGroupExitence, nowAllExitence } from "@/hooks/all-exitence/allExitence";
import Status from "@/interfaces/Status";
import { reactive, toRaw } from "vue";

export type TItem = {
    name:string, //分类or分组名
    key:string, //键名
    child:(GItem|EItem)[], //子元素
}
export type GItem = {
    name:string, //分类or分组名
    key:string, //键名
    child:EItem[], //子元素
}
export type EItem = {
    name:string, //事物名
    key:[string,string], //事物键
    state:boolean|"mid"|"disabled"
    status:{ 
        name:string, //属性名
        key:string //属性键
    }[],
    targetStatus:string //选择的属性键
}

//获得用来生成树状选择结构的列表
export function getList(){
    const targetList = getTargetList()
    //遍历
    const typeItemList = targetList.map(typeData=>{
        const type = typeData.type;
        const exitenceList = typeData.exitence.map(exitenceData=>exitenceData.exitence);
        //获取其中的分组对象
        const groupItemList:GItem[] = type.groups.flatMap(group=>{
            return getGroupItem(type.__key,exitenceList,typeData.exitence,group)
        })
        //获取没有分组的事物与相应的数据
        const noGroupExitence = getNoGroupExitence(exitenceList,type.groups)
        const noGroupExitenceItemList = getExitenceItemList(type.__key,typeData.exitence,noGroupExitence)
        //返回分类数据
        return {
            name:type.name,
            key:type.__key,
            child:[...groupItemList,...noGroupExitenceItemList],
            state:false
        }
    })
    //返回树状结构列表
    return reactive(typeItemList)
    function getGroupItem(typeKey:string,exitenceList:Exitence[],eDataList:EData[],group:Group){
        //获取在该分组中的事物
        const eInGroup = getExitenceInGroup(exitenceList,group)
        if(eInGroup.length<=0)return []
        //获取对应的事物数据，包含了事物的属性哦
        const eInGroupItem = getExitenceItemList(typeKey,eDataList,eInGroup)
        //返回分组数据
        return {
            name:group.name,
            key:group.__key,
            child:eInGroupItem,
            state:false,
        }
    }
    function getExitenceItemList(typeKey:string,eDataList:EData[],exitenceList:Exitence[]):EItem[]{
        return exitenceList.flatMap((exitence)=>{
            const eData = eDataList.find((eData)=>eData.exitence == exitence)
            if(eData) return {
                name:eData.exitence.name,
                key:[typeKey,eData.exitence.__key],
                status:eData.status,
                state:false,
                targetStatus:eData.status[0].key
            }
            return []
        })
    }
}

//选择指定的事物
let chosenItem:null|EItem = null
export function chooseTarget(item:EItem){
    //再次选择取消
    if(item.state===true){
        item.state = false;
        chosenItem = null
        return;
    }
    if(item.targetStatus){
        //取消已选择对象
        if(chosenItem){
            chosenItem.state = false
        }
        item.state = true
        chosenItem = item
    }
}

//获得最终选择的目标的key值用于时间线中
export function getChosenKey(){
    if(chosenItem){
        const chosenKey = {
            sourceKey:toRaw(chosenItem.key),
            targetKey:chosenItem.targetStatus
        }
        //获取选择的目标
        return chosenKey
    }
    return null
}

type EData = {
    exitence:Exitence,
    status:{
        name:string,
        key:string
    }[]
}
//获得需要进一步加工的数据，主要是要向其中添加分组结构
function getTargetList(){
    //列出所有事物中，包含关联属性，且关联属性中包含时间子属性的事物及其所属的分类
    const targetList = nowAllExitence.types.flatMap(type=>{
        //type中满足条件的事物
        const exitenceList = type.exitence.flatMap(exitence=>{
            return getExitenceData(type,exitence)
        })
        //数量大于0
        if(exitenceList.length>0){
            return {
                type:type,
                exitence:exitenceList
            }
        }
        return []
    })
    return targetList
    
    //获取事物数据
    function getExitenceData(type:Type,exitence:Exitence){
        const statusList = exitence.status.flatMap(eStatus=>{
            return getStatusData(type,exitence,eStatus)
        })
        if(statusList.length>0){
            return {
                exitence:exitence,
                status:statusList
            }
        }
        return []
    }
    //获取事物属性数据
    function getStatusData(type:Type,exitence:Exitence,eStatus:ExitenceStatus){
        //要求该属性是关联属性
        const fullStatus = getExitenceStatusByKey(eStatus.__key,exitence.status,type.typeStatus)
        if(fullStatus && fullStatus.valueType=="relation"){
            //其子属性中包含至少一个时间属性
            const allChild:Record<string,Status> = fullStatus.setting["relationSource"]
            if(hasTimeStatus(allChild)){
                return {
                    name:fullStatus.name,
                    key:fullStatus.__key
                }
            }
        }
        return []
    }
    //判断是否有时间属性
    function hasTimeStatus(allStatus:Record<string,Status>){
        return Object.values(allStatus).some(child=>child.valueType == "date")
    }
}