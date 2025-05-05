import { Exitence } from "@/class/Exitence";
import { Group } from "@/class/Group";
import { Type } from "@/class/Type";
import { ifExitenceInAnyGroup, ifExitenceInGroup, nowAllExitence } from "@/hooks/all-exitence/allExitence";

type BaseData = {
    name: string; 
    key: string; 
    state:boolean|"mid",
}
type ParentData<ChildData> = BaseData&{
    child:(BaseData&ChildData)[],
}
type ParentDataInTree<Child> = BaseData & {
    child:Child[]
}
export type TypeDataInTree<ExitenceData,GroupData,TypeData> = (ParentDataInTree<ExitenceData&BaseData|(ParentData<ExitenceData>&GroupData)>&TypeData)
export type ExitenceDataInTree<ExitenceData> = BaseData & ExitenceData

type ExitenceMap<ExitenceData> = Map<Exitence,ExitenceData&BaseData>

export function getChooseExitenceListInTreeList<TypeData,ExitenceData,GroupData>({
    typeList,ifGroup,getTypeData,getExitenceData,getGroupData
}:{
    typeList?:Type[],//用于生成选项的分类的列表
    ifGroup:boolean,
    getTypeData:(type:Type)=>TypeData|false,//用于生成额外的分类数据
    getExitenceData:(type:Type,typeData:TypeData,exitence:Exitence)=>ExitenceData|false
    getGroupData:(type:Type,typeData:TypeData,group:Group)=>GroupData|false
}){
    //分类列表
    if(!typeList){
        typeList = nowAllExitence.types
    }
    //遍历分类
    const list:(ParentData<ExitenceData|(ParentData<ExitenceData>&GroupData)>&TypeData)[] = typeList.flatMap((type)=>{
        //获取分类的额外数据，返回false使得跳过该分类
        const typeData = getTypeData(type)
        if(typeData===false)return []
        //获取所有的事物与相应数据
        const exitenceDataMap = getExitenceDataMap<ExitenceData>(type.exitence,(exitence)=>{
            return getExitenceData(type,typeData,exitence)
        })
        //若没有符合条件的事物（事物map为空）则跳过该分类
        if(exitenceDataMap.size == 0){
            return []
        }
        //启用分组
        if(ifGroup){
            //获取分组的数据列表
            const groupDataList = getGroupDataList<GroupData,ExitenceData>(type,exitenceDataMap,(group)=>{
                return getGroupData(type,typeData,group)
            })
            //获取没有在分组中的事物数据的列表
            const noGroupExitenceDataList:(ExitenceData&BaseData)[] = []
            for(let [exitence,exitenceData] of exitenceDataMap){
                if(!ifExitenceInAnyGroup(exitence,type.groups)){
                    noGroupExitenceDataList.push(exitenceData)
                }
            }
            //返回包含了分组数据的分类数据
            return {
                name: type.name,
                key:type.__key,
                state:false,
                child:[...groupDataList,...noGroupExitenceDataList],
                ...typeData
            }
        }
        //否则返回分类下的所有事物的数据
        else{
            const exitenceDataList = exitenceDataMap.values()
            return {
                name: type.name,
                key:type.__key,
                state:false,
                child:[...exitenceDataList],
                ...typeData
            }
        }
    })
    console.log("新版的list",list)
    return list
}
function getGroupDataList<GroupData,ExitenceData>(
    type:Type,
    exitenceDataMap:ExitenceMap<ExitenceData>,
    getGroupData:(group:Group)=>GroupData|false,
):(ParentData<ExitenceData>&GroupData)[]{
    //遍历各个分组，获得分组的数据列表
    return type.groups.flatMap(group=>{
        const groupData = getGroupData(group)
        if(groupData===false)return []
        //分组中的事物
        const exitenceDataList:(BaseData&ExitenceData)[] = []
        //遍历map，获取其中在分类中的事物和相应的事物数据
        for(let [exitence,exitenceData] of exitenceDataMap){
            if(ifExitenceInGroup(exitence,group)){
                exitenceDataList.push(exitenceData)
            }
        }
        //没有事物时不添加该分组
        if(exitenceDataList.length<=0)return []
        //添加该分组的数据
        return {
            name:group.name,
            state:false,
            child:exitenceDataList,
            key:group.__key,
            ...groupData
        }
    })
}
//获取事物数据映射表
function getExitenceDataMap<ExitenceData>(
    getFrom:Exitence[],//事物来源
    getExitenceData:(exitence:Exitence)=>ExitenceData|false
){
    const exitenceDataMap = new Map<Exitence,BaseData & ExitenceData>()
    for(let exitence of getFrom){
        //获取事物的额外属性，返回false使得跳过该事物
        const exitenceData = getExitenceData(exitence)
        if(!exitenceData)continue;
        exitenceDataMap.set(exitence,{
            name:exitence.name,
            key:exitence.__key,
            state:false,
            ...exitenceData
        })
    }
    return exitenceDataMap
}
