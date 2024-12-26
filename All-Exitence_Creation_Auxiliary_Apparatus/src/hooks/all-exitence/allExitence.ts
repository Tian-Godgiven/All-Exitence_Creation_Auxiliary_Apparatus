import { Exitence } from "@/class/Exitence"
import { Type } from "@/class/Type"
import { showPopUp } from "../popUp";
import { reactive } from "vue";
import Status from "@/interfaces/exitenceStatus";
import { Group } from "@/class/Group";
import { nanoid } from "nanoid";
import { addInputSuggestion } from "../inputSupport/inputSuggestion/inputSuggestion";

//当前万物
export const nowAllExitence = reactive<{[types:string]:Type[]}>({types:[]})

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
    export function checkTypeNameRepeat(typeName:string){
        const tmp = nowAllExitence.types.find((type:Type)=>{
            if(type.name == typeName){
                return type
            }
        })
        if(tmp){
            return true
        }
        else{
            return false
        }
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
        const type = new Type(typeName,typeStatus,typeSetting,[],[])
        nowAllExitence.types.push(type)
    }

    // 显示创建分类页面，创建成功时添加该分类
    export function createType(){
        // 显示创建分类页面
        showPopUp({
            name:"创建分类",
            buttons:[],
            vueName:"createType",
            mask:true,
        })
    }

//事物相关
    //向分类中添加新的事物
    export function addExitence(type:Type,name:string,tags:any[]){
        if(!name || name == ""){
            name = "未命名"+type.name
        }
        //创建该事物，并为其分配一个nanoid
        const newExitence = new Exitence(name,[],type.name,{},nanoid())
        //添加分类的属性
        type.typeStatus.forEach((status:Status)=>{
            newExitence.status.push({
                __key:status.__key
            })
        })
        //添加标签属性
        newExitence.status.push({
            name:"标签",
            value:tags,
            valueType:"tags",
            setting:{}
        })
        type.exitence.push(newExitence)

        //创建该事物的输入建议
        addInputSuggestion({
            text:newExitence.name,
            type:"exitence",
            info:"创建的事物"
        },newExitence,"project")
        
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
    export function getExitenceStatusByKey(statusKey:any,allStatus:any[],allTypeStatus?:any[],every?:boolean){
        const status = allStatus.find((tmp:Status)=>{
            if(tmp.__key == statusKey){
                return tmp
            }
        })
        //不要求所有属性的情况下，直接返回事物的该属性
        if(!every){
            return status
        }
        if(!allTypeStatus){
            return false
        }
        const typeStatus = allTypeStatus.find((tmp:Status)=>{
            if(tmp.__key == statusKey){
                return tmp
            }
        })
        //优先使用status中的valueType
        let valueType = status["valueType"] || typeStatus["valueType"]
        //优先使用两者覆盖后的setting
        const statusSetting = (function(){
            if(typeStatus){
                return {...typeStatus.setting,...status?.setting}
            }
        })()

        return {
            value:status.value,
            valueType:valueType,
            setting:statusSetting
        }
    }
// 分组相关
    // 显示创建分组页面，创建成功时添加该分组并通过resolve返回
    export async function createGroup(type:Type):Promise<Group>{
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
                        reject("未能成功创建事物")
                    }
                    resolve(newGroup)
                }
            })
        })
    }
    // 显示编辑分组页面，显示该分组
    export async function updateGroup(type:Type,group:Group){
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
    
