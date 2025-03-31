import { ExitenceStatus } from "@/class/Exitence";
import Status from "@/interfaces/Status";

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