import { ExitenceStatus } from "@/class/Exitence";
import Status from "@/interfaces/Status";
import _, { cloneDeep, isNumber, toNumber, toString } from "lodash";

//初始的空属性对象
export const defaultStatus:Status = {
    name:"",
    value:null,
    valueType:"input",
    setting:{},
    __key:""
}

//拼接两个属性，获得一个完整的属性对象
export function getFullStatus(status1:ExitenceStatus,status2:Status):Status
export function getFullStatus(status1:Status,status2?:Status):Status
export function getFullStatus(status1:Status|ExitenceStatus,status2?:Status):Status{
    let fullStatus
    if(status2){
        //让status1的值覆盖在status2上
        fullStatus = _.merge({},status2,status1)
    }
    else{
        fullStatus = cloneDeep(status1)
    }
    return fullStatus as Status
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
 */
export function getSettingValue(setting:Record<string,any>,setName:string,valueType:"string"|"number"|"bool"){
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
            console.log(setting,value,typeof value)
            if(typeof value == "boolean"){
                return value
            }
            return null
        }
    }
    
}

