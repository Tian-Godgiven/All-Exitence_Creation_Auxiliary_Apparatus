import { Exitence } from "@/class/Exitence";
import { Group } from "@/class/Group";
import { Type } from "@/class/Type";
import { ifExitenceInAnyGroup, ifExitenceInGroup, nowAllExitence } from "@/hooks/all-exitence/allExitence";
import { reactive } from "vue";

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

export function getChooseExitenceInTreeList({typeList,ifGroup,chosenExitenceKey}:{
    typeList?:Type[],
    ifGroup:boolean,
    chosenExitenceKey:string[]
}):TypeDataInTree<{},{},{}>[]
export function getChooseExitenceInTreeList<TypeData,ExitenceData,GroupData>({
    typeList,ifGroup,chosenExitenceKey,getTypeData,getExitenceData,getGroupData
}:{
    typeList?:Type[],//用于生成选项的分类的列表
    ifGroup:boolean, 
    chosenExitenceKey?:string[],//已选中的事物列表
    getTypeData:(type:Type)=>TypeData|false,//用于生成额外的分类数据
    getExitenceData:(type:Type,typeData:TypeData,exitence:Exitence)=>ExitenceData|false
    getGroupData:(type:Type,typeData:TypeData,group:Group)=>GroupData|false
}):TypeDataInTree<ExitenceData,GroupData,TypeData>[]
export function getChooseExitenceInTreeList<TypeData={},ExitenceData={},GroupData={}>({
    typeList,ifGroup,chosenExitenceKey,getTypeData,getExitenceData,getGroupData
}:{
    typeList?:Type[],//用于生成选项的分类的列表
    ifGroup:boolean,
    chosenExitenceKey?:string[],//已选中的事物列表
    getTypeData?:(type:Type)=>TypeData|false,//用于生成额外的分类数据
    getExitenceData?:(type:Type,typeData:TypeData,exitence:Exitence)=>ExitenceData|false
    getGroupData?:(type:Type,typeData:TypeData,group:Group)=>GroupData|false
}){
    //分类列表
    if(!typeList){
        typeList = nowAllExitence.types
    }
    //已选择列表
    if(!chosenExitenceKey){
        chosenExitenceKey = []
    }
    //遍历分类
    const list:TypeDataInTree<ExitenceData,GroupData,TypeData>[] = typeList.flatMap((type)=>{
        //获取分类的额外数据，返回false使得跳过该分类
        const typeData = getTypeData?.(type)??{} as TypeData
        if(typeData===false)return []
        //获取所有的事物与相应数据
        const {exitenceDataMap,typeState} = getExitenceDataMap<ExitenceData>(type.exitence,(exitence)=>{
            return getExitenceData?.(type,typeData,exitence)??{} as ExitenceData
        },chosenExitenceKey)
        //若没有符合条件的事物（事物map为空）则跳过该分类
        if(exitenceDataMap.size == 0){
            return []
        }
        //启用分组
        if(ifGroup){
            //获取分组的数据列表
            const groupDataList = getGroupDataList<GroupData,ExitenceData>(type,exitenceDataMap,(group)=>{
                return getGroupData?.(type,typeData,group)??{} as GroupData
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
                state:typeState,
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
                state:typeState,
                child:[...exitenceDataList],
                ...typeData
            }
        }
    })
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
        //查看其中的事物的状态，并以此决定分组的状态
        const count = exitenceDataList.reduce((acc, item) => item.state==true ? acc + 1 : acc, 0);
        let groupState:boolean|"mid" = false
        if(count > 0){
            if(count == exitenceDataList.length){
                groupState = true
            }
            groupState = "mid"
        }
        //添加该分组的数据
        return {
            name:group.name,
            state:groupState,
            child:exitenceDataList,
            key:group.__key,
            ...groupData
        }
    })
}
//获取事物数据映射表
function getExitenceDataMap<ExitenceData>(
    getFrom:Exitence[],//事物来源
    getExitenceData:(exitence:Exitence)=>ExitenceData|false,
    chosenKeyList:string[]
){
    let chosenNum = 0 //已选择的数量
    const exitenceDataMap = new Map<Exitence,BaseData & ExitenceData>()
    for(let exitence of getFrom){
        //获取事物的额外属性，返回false使得跳过该事物
        const exitenceData = getExitenceData(exitence)
        if(!exitenceData)continue;
        //若事物在已选中的列表中，则状态为true
        const state = chosenKeyList.includes(exitence.__key)
        if(state)chosenNum+=1
        exitenceDataMap.set(exitence,{
            name:exitence.name,
            key:exitence.__key,
            state,
            ...exitenceData
        })
    }
    //返回此时分类的状态
    let typeState:boolean|"mid" = false
    if(chosenNum > 0){
        if(chosenNum == exitenceDataMap.size){
            typeState = true
        }
        else{
            typeState = "mid"
        }
    }
    return {exitenceDataMap,typeState}
}

//获取list中选择了的事物对象与其所属的分类，如果传入reactive的list，则返回的内容也保持了reactive的响应式
export function getChosenExitenceInTree<TypeData,GroupData,ExitenceData>(
    list: TypeDataInTree<ExitenceData,GroupData,TypeData>[],
){
     // 遍历列表
    const chosenList = list.flatMap(type=>{
        // 如果没有子元素，跳过该type
        if (!type.child||type.child.length===0) return [];  
        // 遍历分类的子元素，获取其中被选中的事物
        const chosenExitence = type.child.flatMap(child=>{
            if (child.state === false) return [];
            //是分组
            if ('child' in child) {
                child.child.forEach(exitence => {
                    if (exitence.state === true) {
                        return exitence
                    }
                });
                return []
            }
            //是事物 
            else {
                return child
            }
        })
        //如果选中的事物的数量也为0，仍然跳过该type
        if(chosenExitence.length == 0)return []
        //一份type的浅拷贝，保持对type属性的引用，但没有child,而是选择的事物列表
        const type2 = reactive(Object.assign({}, type));
        delete (type2 as any).child;  // 删除child属性
        return {
            type:type2,
            exitences:chosenExitence
        }
    })
    return chosenList
}