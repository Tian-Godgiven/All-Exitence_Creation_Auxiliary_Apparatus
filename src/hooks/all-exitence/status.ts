import { ExitenceStatus } from "@/class/Exitence";
import Status from "@/interfaces/Status";
import _, { cloneDeep } from "lodash";

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

//为一个属性设置设置项
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
//清楚一个属性的指定设置项
export function deleteStatusSetting(status:Status|ExitenceStatus,setName:string){
    if(status.setting){
        delete status.setting[setName]
    }
}