 import { Exitence, ExitenceStatus } from "@/class/Exitence";
import Status from "@/interfaces/Status";
import _, { cloneDeep, isArray, isNumber, toNumber, toString } from "lodash";
import { nanoid } from "nanoid";
import { computed, ComputedRef } from "vue";
import { PopUpSet, showPopUp } from "../pages/popUp";
import { Type } from "@/class/Type";
import { getTypeStatusByKey } from "./allExitence";

//创建一个新的空属性对象
export function createNewEmptyStatus(){
    return {
        name:"",
        value:null,
        valueType:"input",
        setting:{},
        __key:nanoid()
    }
}

//拼接两个属性，获得一个响应式的完整的属性对象
export function getFullStatus(smaller:ExitenceStatus,bigger?:Status):ComputedRef<Status>
export function getFullStatus(smaller:Status,bigger?:Status):ComputedRef<Status>
export function getFullStatus(smaller:Status|ExitenceStatus,bigger?:Status):ComputedRef<Status>{
    return computed(()=>{
        let fullStatus:Status
        if(bigger){
            //让小属性的值覆盖在status2上
            fullStatus = _.merge({},bigger,smaller)
        }
        //不传入更大的属性时，如果小属性的内容不足，则会自动填补
        else{
            const status = cloneDeep(smaller)
            if(!smaller.name){
                status.name = "无名称"
            }
            if(!smaller.setting){
                status.setting = {}
            }
            if(!smaller.valueType){
                status.valueType = "input"
            }
            fullStatus = status as Status
        }
        return fullStatus
    })
}

//获取一个事物的完整属性
export function getFullStatusOfExitence(type:Type,status:ExitenceStatus){
    //从Type中寻找相关的属性
    const typeStatus = getTypeStatusByKey(status.__key,type?.typeStatus)
    if(!typeStatus){
        return getFullStatus(status)
    }
    return getFullStatus(status,typeStatus)
}

//为一个属性设置设置项的值
export function setStatus(status:Status|ExitenceStatus,setName:string,setValue:any){
    //检查是否有设置属性
    if(status.setting){
        status.setting[setName] = setValue
    }
    else{
        //先创建设置属性
        status.setting = {}
        status.setting[setName] = setValue
    }
    return status
}
//清除一个属性的指定设置项
export function deleteStatusSetting(status:Status|ExitenceStatus,setName:string){
    if(status.setting){
        delete status.setting[setName]
    }
}
/**
 * 获取属性的指定设置项当前的设置值，还会进行类型转换
 * @param statuSetting 属性对象的设置，或者任意的属性设置
 * @param setName 设置项名
 * @param valueType 需要的返回值类型 
 *      string:去除空格后的字符串，空字符串时会返回null
 *      number:仅在值完全是纯数字(不包括带数字的字符串和bool)时返回数字，否则均返回null
 *      bool:仅在值完全是布尔值时返回布尔值，否则会返回null
 *      arr:一个指定泛型的数组，仅在数组元素类型符合泛型时返回数组，否则返回null
 */
    export function getStatusSettingValue(
        setting: Record<string, any>,
        setName: string,
        valueType: "string"
    ): string | null;
    export function getStatusSettingValue(
        setting: Record<string, any>,
        setName: string,
        valueType: "number"
    ): number | null;
    export function getStatusSettingValue(
        setting: Record<string, any>,
        setName: string,
        valueType: "bool"
    ): boolean | null;
    export function getStatusSettingValue<T>(
        setting: Record<string, any>,
        setName: string,
        valueType: "arr"
    ): T[] | null;
    export function getStatusSettingValue<T>(
        setting: Record<string, any>,
        setName: string,
        valueType: "obj"
    ): T | null;
export function getStatusSettingValue<T>(
    setting: Record<string, any>,
    setName: string,
    valueType: "string" | "number" | "bool" | "arr"|"obj"
): string | number | boolean | T[] | T | null{
    let value = setting[setName]
    if(!value){
        value = null
    }
    //类型转换 
    switch(valueType){
        case "string":{
            //去除空格
            value = toString(value).trim()
            //空字符串视为null
            if(value == "")return null
            return value
        }
        case "number":{
            //排除是空字符串
            if(toString(value).trim()==""){
                return null
            }
            //转化为数字,NaN也是数字哦
            value = toNumber(value)
            if(isNumber(value)&&!Number.isNaN(value))return value
            return null
        }
        case "bool":{
            if(typeof value == "boolean"){
                return value
            }
            return null
        }
        case "arr":{
            if(isArray(value)){
                return value as T[]
            }
            return null
        }
        case "obj":{
            return value as T
        }
        default:{
            return null
        }
    }
    
}
//打开一个属性编辑弹窗，并编辑一个属性
export function showEditStatusPopUp<T extends Status|ExitenceStatus>({
    name,target,status,fullStatus,banValueType,confirmText,returnValue
}:{
    name?:string,
    target:Exitence|Type,
    status?:T,
    fullStatus:Status,
    banValueType?:string[],
    confirmText?:string,
    returnValue:(newStatus:T)=>void
}){
    showPopUp({
        name,
        mask:false,
        vueName:"updateStatus",
        buttons:[],
        props:{
            target,
            status,
            fullStatus,
            banValueType,
            confirmText
        },
        returnValue:returnValue
    })
}

//打开一个创建新属性弹窗
export function showCreateStatusPopUp({
    returnValue,banValueType,confirmText,popUpSet={}
}:{
    popUpSet?:PopUpSet
    returnValue:(newStatus:Status)=>void,
    banValueType?:string[],
    confirmText?:string,
}){
    const status = createNewEmptyStatus()
    showPopUp({
        ...popUpSet,
        vueName:"updateStatus",
        buttons:[],
        props:{
            status,
            fullStatus:status,
            banValueType,
            confirmText
        },
        returnValue:returnValue,
    })
}