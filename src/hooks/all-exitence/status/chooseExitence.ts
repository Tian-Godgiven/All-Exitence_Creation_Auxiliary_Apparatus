import Status from "@/interfaces/Status";
import { getExitenceByKey, getTypeByKey } from "../allExitence";

export type ChooseExitenceStatus = Omit<Status, 'value'> & {
    valueType:"chooseExitence",
    value:Record<string,{
        title:string,
        exitenceKey:string[]
    }>
}

//像【选择事物】属性中添加一个事物
export function addExitenceToChooseExitenceStatus(status:ChooseExitenceStatus,typeKey:string,typeName:string,exitenceKey:string){
    //初始化属性值
    if(!status.value){
        status.value = {}
    }
    //判断是否存在对应的typeKey
    if(status.value?.[typeKey]?.["exitenceKey"]){
        status.value[typeKey]["exitenceKey"].push(exitenceKey)
    }
    //否则创建
    else{
        status.value[typeKey] = {
            title:typeName,
            exitenceKey:[exitenceKey]
        }
    }
}

//从属性中移除指定事物
export function removeExitenceFromChooseExitenceStatus(status:ChooseExitenceStatus,typeKey:string,exitenceKey:string){
    //寻找指定事物所在的数组
    const arr = status.value?.[typeKey]?.exitenceKey
    if(arr){
        const index = arr.findIndex(value=>value==exitenceKey)
        if(index>=0){
            arr.splice(index,1)
        }
    }
}

//根据【选择事物】属性值，获取事物列表
export function getChooseExitenceStatusList(status:ChooseExitenceStatus){
    if(!status.value)return []
    const list = Object.entries(status.value).flatMap(([typeKey,item])=>{
        //找到这个type
        const type = getTypeByKey(typeKey)
        if(!type)return[];
        //然后找到对应的exitence列表
        const exitenceList:{name:string,key:string}[] = item.exitenceKey.flatMap((exitenceKey:string)=>{
            const exitence = getExitenceByKey(type,exitenceKey)
            if(exitence){
                return {
                    name:exitence.name,
                    key:exitence.__key
                }
            }
            return []
        })
        //如果长度为0则跳过
        if(exitenceList.length == 0)return[]
        //添加到列表中
        return {
            title:item.title,
            typeKey:type.__key,
            exitences:exitenceList
        }
    })
    return list
}