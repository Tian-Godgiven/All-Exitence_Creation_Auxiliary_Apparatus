import { Exitence } from "@/class/Exitence"
import { Type } from "@/class/Type"
import { showPopUp } from "../pages/popUp";
import { reactive } from "vue";
import Status from "@/interfaces/exitenceStatus";
import { Group } from "@/class/Group";
import { nanoid } from "nanoid";
import { addExitenceInputSuggestion, changeExitenceInputSuggestion, deleteExitenceInputSuggestion } from "../inputSupport/inputSuggestion/inputSuggestion";
import { showAlert } from "../alert";
import { filterExitenceByRule } from "../expression/groupRule";

//当前万物
export const nowAllExitence = reactive<{types:Type[]}>({types:[]})

//修改当前万物
export function changeNowAllExitence(newAllExitence:{types:Type[]}){
    //不知道为什么有时会传一个字符串过来？？？
    if(typeof newAllExitence != "object"){
        newAllExitence = JSON.parse(newAllExitence)
    }
    nowAllExitence.types = newAllExitence.types
}

//分类相关
    //判断分类名称是否重复
    export function checkTypeNameRepeat(typeName:string,type?:Type){
        const tmp = nowAllExitence.types?.find((type:Type)=>{
            if(type.name == typeName){
                return type
            }
        })
        //若重复
        if(tmp){
            //并且不与传入的type为同一个type
            if(type && tmp != type){
                return true
            }
        }
        return false
    }

    // 获取key对应的分类的属性
    export function getTypeStatusByKey(statusKey:any,allTypeStatus:[]):Status | undefined{
        return allTypeStatus.find((tmp:Status)=>{
            if(tmp.__key == statusKey){
                return tmp
            }
        })
    }

    //向万物中添加新的分类
    export function addType(typeName:string,typeStatus:[],typeSetting:{}){
        try{
            const type = new Type(typeName,typeStatus,typeSetting,[],[],nanoid())
            nowAllExitence.types.push(type)
        }
        catch(err){
            console.error(err)
        }
        
    }

    // 显示创建分类页面，创建成功时添加该分类
    export function createType(){
        // 显示创建分类页面
        showPopUp({
            name:"创建分类",
            buttons:[],
            vueName:"createType",
            mask:true,
            returnValue:(name,typeStatus,setting)=>{
                //添加该分类
		        addType(name,typeStatus,setting)
            }
        })
    }

    // 显示编辑分类页面
    export function updateTypePopUp(type:Type){
        showPopUp({
            vueName:"updateType",
            mask:true,
            buttons:[],
            props:{
                type:type,
            },
            returnValue:(name:string,typeStatus:Status[],setting:{})=>{
                type.name = name;
                type.typeStatus = typeStatus;
                type.setting= setting
            }
        })
    }

    // 删除分类
    export function deleteTypePopUp(type:Type){
        //进行提示
        showAlert({
            info:`删除分类${type.name}及其中的所有内容？`,
            "confirm":()=>{
                deleteType(type)
            }
        })
    }
    export function deleteType(type:Type){
        //分别删除其中的事物
        type.exitence.forEach((exitence:Exitence)=>{
            deleteExitence(exitence)
        })
        //再从项目中删除该分类
        const index = nowAllExitence.types.indexOf(type)
        nowAllExitence.types.splice(index,1)
    }

// 事物相关
    //向分类中添加新的事物
    export function addExitence(type:Type,exitence:Exitence){
        //向分类中添加该事物
        type.exitence.push(exitence)
        //创建该事物的输入建议
        addExitenceInputSuggestion(type,exitence)
        
        return exitence
    }

    // 创建一个新的事物
    export function createNewExitence(name:string,status:any[],setting:any,type:Type){
        if(!name || name == ""){
            name = "未命名"+type.name
        }
        //创建该事物，并为其分配key
        const newExitence = new Exitence(name,status,type.__key,setting,nanoid())
        //添加分类中的属性
        const tmp:any[] = []
        type.typeStatus.forEach((status:Status)=>{
            tmp.push({
                __key:status.__key
            })
        })
        newExitence.status.unshift(...tmp) //这里要求让分类中的属性优先放置在顶部
        return newExitence
    }

    // 显示创建事物页面，创建成功时添加该事物并通过resolve返回
    export async function createExitence(type:Type):Promise<Exitence>{
        return new Promise((resolve,reject)=>{
            // 显示创建事物页面
            showPopUp({
                name:"创建事物",
                props:{
                    type
                },
                buttons:[],
                vueName:"createExitence",
                mask:true,
                //创建成功时
                returnValue:(newExitence)=>{
                    if(!newExitence){
                        reject("未能成功创建事物")
                    }
                    resolve(newExitence)
                }
            })
        })
        
    }

    // 获取key对应的事物的属性
    export function getExitenceStatusByKey(statusKey:any,allStatus:any[],allTypeStatus?:any[]){
        if(!statusKey)return false
        const status = allStatus.find((tmp:Status)=>tmp.__key == statusKey)
        if(!status){return false}
        //只需要事物属性的内容时，无需传入allTypeStatus
        if(!allTypeStatus){
            return status
        }
        const typeStatus = allTypeStatus.find((tmp:Status)=>{
            if(tmp.__key == statusKey){
                return tmp
            }
        })
        //优先使用两者覆盖后的setting
        const statusSetting = (function(){
            if(typeStatus){
                return {...typeStatus.setting,...status?.setting}
            }
        })()

        return {
            name:status?.name || typeStatus?.name || null,
            value:("value" in status)? status.value : typeStatus.value,
            valueType:status["valueType"] || typeStatus["valueType"],
            setting:statusSetting
        }
    }

    // 弹出弹窗，选择是否删除指定事物
    export function deleteExitencePopUp(type:Type,exitence:Exitence){
        showAlert({
            "info":`删除${type.name}中的事物${exitence.name}？\n
                这会使得所有指向该事物的索引失效！`,
            confirm:()=>{
                deleteExitence(exitence,type)
            }
        })
    }
    // 删除指定事物
    export function deleteExitence(exitence:Exitence,type?:Type){
        if(type){
            const index = type.exitence.indexOf(exitence)
            type.exitence.splice(index,1)
        }
        //删除事物的输入建议
        deleteExitenceInputSuggestion(exitence.__key)
    }



    // 改变事物名称
    export function changeExitenceName(exitence:Exitence,newName:string,sync?:boolean){
        exitence.name = newName
        // 改变输入建议列表中的名称
        changeExitenceInputSuggestion(exitence.__key,"name",newName)

        if(sync){return}//如果本来就是因为同步，则不继续
        // 事物设置：指定属性与事物名称同步
        const syncStatusKey = exitence.setting.syncWithName
        if(syncStatusKey){
            const status = getExitenceStatusByKey(syncStatusKey,exitence.status)
            status.value = newName
        }
    }
    // 改变事物别名
    export function changeExitenceNickName(exitence:Exitence,newNickName:string[]){
        //改变输入建议中的别名
        changeExitenceInputSuggestion(exitence.__key,"nickName",newNickName)
    }


// 分组相关
    // 显示创建分组页面，创建成功时添加该分组并通过resolve返回
    export async function createGroupPopUp(type:Type):Promise<Group>{
        return new Promise((resolve,reject)=>{
            // 显示创建事物页面
            showPopUp({
                name:"创建分组",
                props:{
                    type
                },
                buttons:[],
                vueName:"createGroup",
                mask:true,
                returnValue:(newGroup)=>{
                    if(!newGroup){
                        reject("未能成功创建分组")
                    }
                    //创建该分组
                    addGroup(type,newGroup)
                    resolve(newGroup)
                }
            })
        })
    }
    // 显示编辑分组页面，显示该分组
    export async function updateGroupPopUp(type:Type,group:Group){
        return new Promise((resolve,reject)=>{
            // 显示编辑分组页面
            showPopUp({
                name:"编辑分组",
                props:{
                    type,
                    group
                },
                buttons:[],
                vueName:"updateGroup",
                mask:true,
                returnValue:(newGroup)=>{
                    if(!newGroup){
                        reject("未能成功编辑事物")
                    }
                    //修改group
                    Object.assign(group,newGroup)
                    resolve(newGroup)
                }
            })
        })
    }
    //使用分类，向其中添加新的分组
    export function addGroup(type:Type,{name,rules,setting}:any){
        const newGroup= new Group(name,rules,setting)
        type.groups.push(newGroup)
        return newGroup
    }
    // 删除分组
    export function deleteGroup(type:Type,group:Group){
        showAlert({
            info:`删除${type.name}中的分组${group.name}？`,
            confirm:()=>{
                
                //从type中移除这个group
                const index = type.groups.indexOf(group)
                type.groups.splice(index,1)
            }
        })
    }
    // 获取指定分类中，满足分组规则的事物
    export function getExitenceInGroup(type:Type,group:Group){
        //遍历所有事物，获取满足条件的部分
        const tmp = type.exitence.reduce((arr:any[],exitence:any)=>{
            if(filterExitenceByRule(exitence,group.rules)){
                arr.push(exitence)
            }
            return arr
        },[])
        return tmp
    }
