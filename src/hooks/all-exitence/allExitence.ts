import { Exitence, ExitenceStatus } from "@/class/Exitence"
import { Type } from "@/class/Type"
import { showPopUp } from "../pages/popUp";
import { reactive } from "vue";
import Status from "@/interfaces/Status";
import { Group } from "@/class/Group";
import { nanoid } from "nanoid";
import { addExitenceInputSuggestion, changeExitenceInputSuggestion, deleteExitenceInputSuggestion } from "../../supportAbility/inputSuggestion/suggester/inputSuggestion";
import { showAlert } from "../alert";
import { filterExitenceByRule } from "../expression/groupRule";
import { isArray} from "lodash";
import { deleteShowOnMain, showOnMain, showTargetOnMain } from "../pages/mainPage/showOnMain";
import { focusOnLeftPage, scrollToLeftTarget } from "../pages/leftPage";
import { translateToTextContent } from "../expression/textAreaContent";

//当前万物
export const nowAllExitence = reactive<{types:Type[]}>({types:[]})

//修改当前万物
export function changeNowAllExitence(newAllExitence:{types:Type[]}){
    if(typeof newAllExitence != "object"){
        newAllExitence = JSON.parse(newAllExitence)
    }
    nowAllExitence.types = newAllExitence.types
    console.log("当前所有事物",nowAllExitence)
}

//分类相关
    //判断分类名称是否重复
    export function checkTypeNameRepeat(typeName:string,type?:Type){
        const tmp = nowAllExitence.types?.find((type:Type)=>
            type.name == typeName
        )
        //若重复
        if(tmp){
            //并且不与传入的type为同一个type
            if(type?.__key && tmp.__key != type.__key){
                return true
            }
        }
        return false
    }

    // 获取属性key对应的分类的属性
    export function getTypeStatusByKey(statusKey:string,allTypeStatus:Status[]):Status | false{
        return allTypeStatus.find((tmp:Status)=>
            tmp.__key == statusKey
        )??false
    }

    // 获取分类key对应的分类对象
    export function getTypeByKey(typeKey:string):Type|undefined{
        return nowAllExitence.types.find((type)=>
            type.__key == typeKey
        )
    }
    
    export function getTypeOfExitence(exitence:Exitence){
        const type = getTypeByKey(exitence.typeKey)
        if(!type){
            throw new Error("错误的事物对象，其所属的分类不存在")
        }
        return type
    }

    //创建一个新的分类
    export function createType(name:string,status:Status[],setting:Record<string,any>){
        const type = new Type(name,status,setting,[],[],nanoid())
        return type
    }

    //向万物中添加新的分类
    export function addType(name:string,status:Status[],setting:Record<string,any>){
        const newType = createType(name,status,setting)
        nowAllExitence.types.push(newType)
        return newType
    }
    // 显示创建分类页面，创建成功时添加该分类
    export async function createTypePopUp(){
        return new Promise<Type>((resolve)=>{
            // 显示创建分类页面
            showPopUp({
                name:"创建分类",
                buttons:[],
                vueName:"createType",
                mask:true,
                returnValue:(newType:Type)=>{
                    //添加该分类
                    const type = addType(newType.name,newType.typeStatus,newType.setting)
                    console.log(type)
                    //返回
                    resolve(type)
                }
            })
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
            returnValue:(newType:Type)=>{
                type.name = newType.name
                type.typeStatus = newType.typeStatus
                type.setting= newType.setting
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
            deleteExitence(exitence,type)
        })
        //再从项目中删除该分类
        const index = nowAllExitence.types.indexOf(type)
        nowAllExitence.types.splice(index,1)
    }

    //聚焦指定的分类
    export function focusOnType(type:Type,showLeft:boolean=false){
        //展开分类
        type.expending = true;
        //在左侧页面聚焦
        focusOnLeftPage(type.__key,"all-exitence",showLeft)
        //滚动到指定位置
        scrollToLeftTarget("type",type.__key)
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
    export function createExitence(name:string,status:ExitenceStatus[],setting:any,type:Type){
        if(!name || name == ""){
            name = "未命名"+type.name
        }
        //创建该事物，并为其分配key
        const newExitence = new Exitence(name,status,type.__key,setting,nanoid(),0)
        //添加分类中的属性
        const tmp = type.typeStatus.map(status=>{
            return {
                value:status.value,
                __key:status.__key
            }
        })
        newExitence.status.unshift(...tmp) //这里要求让分类中的属性优先放置在顶部
        return newExitence
    }

    // 显示创建事物页面，创建成功时添加该事物并通过resolve返回
    export async function createExitencePopUp(type?:Type):Promise<Exitence>{
        //如果未传入type则会使用当前聚焦的type
        if(!type){
            //获取当前显示的对象,要求必须是文本
            if(showOnMain.type == "exitence"){
                const typeKey = showOnMain.target.typeKey
                const type = getTypeByKey(typeKey)
                if(type){
                    return await createExitencePopUp(type)
                }   
            }
            throw new Error("创建事物失败")
        }
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

    //打开设置事物弹窗
    export function showSetExitencePopUp(exitence:Exitence,type:Type){
	    showPopUp({
			name:"事物设置",
			vueName:"setExitence",
			mask:true,
			buttons:[],
			props:{
				exitence:exitence,
				type:type
			},
			returnValue(newExitence:Exitence){
				Object.assign(exitence,newExitence)
                console.log(exitence)
			}
		})
    }

    // 获取key对应的分类中的事物
    export function getExitenceByKey(type:Type,exitenceKey:string){
        return type.exitence.find(e=>e.__key == exitenceKey)
    }

    // 获取key对应的事物的属性,这里是函数重载决定返回值类型
    export function getExitenceStatusByKey(statusKey: string, allStatus: ExitenceStatus[]): ExitenceStatus | false;
    export function getExitenceStatusByKey(statusKey: string, allStatus: ExitenceStatus[], allTypeStatus: Status[]): Status | false;
    export function getExitenceStatusByKey(statusKey: string, allStatus: ExitenceStatus[], allTypeStatus?:Status[]){
        const status = allStatus.find((tmp)=>tmp.__key == statusKey)
        if(!status){return false}
        //只需要事物属性的内容时，无需传入allTypeStatus
        if(!allTypeStatus){
            return status
        }

        //如果传入了分类属性，则返回完整属性
        const typeStatus = allTypeStatus.find((tmp)=>
            tmp.__key == statusKey
        )
        //没有找到分类属性，则还是返回事物属性
        if(!typeStatus)return status

        //使用两者覆盖后的setting
        const statusSetting = (()=>{
            return {...typeStatus.setting,...status?.setting}
        })() 
        //返回完整的属性
        const fullStatus:Status =  {
            name:status?.name || typeStatus.name,
            value:("value" in status)? status.value : typeStatus.value,
            valueType:status["valueType"] || typeStatus["valueType"],
            setting:statusSetting,
            __key:statusKey
        }
        return fullStatus
    }

    // 获取事物属性对应的分类中的属性
    export function getTypeStatusOfExitence(exitence:Exitence,statusKey:string){
        //获取该事物对应的分类
        const type = getTypeByKey(exitence.typeKey)
        if(type){
            return getTypeStatusByKey(statusKey,type.typeStatus)
        }
        return undefined
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
    // 删除指定分类中的事物
    export function deleteExitence(exitence:Exitence,type:Type){
        //删除事物的输入建议
        deleteExitenceInputSuggestion(exitence.__key)
        //删除显示在页面上的情况
        deleteShowOnMain(exitence)
        //删除分类中的事物
        const index = type.exitence.indexOf(exitence)
        type.exitence.splice(index,1)
    }

    //聚焦事物对象，将其显示在主页面上
    export function focusOnExitence(exitence:Exitence,showLeft:boolean=false){
        //展开分类或分组
        const type = getTypeByKey(exitence.typeKey)
        if(!type)throw new Error(`没有找到type${exitence}`)
        type.expending = true
        //判断事物是否处于某个分组中
        type.groups.forEach(group=>{
            if(ifExitenceInGroup(exitence,group)){
                //展开这个分组
                group.expending = true
            }
        })
        //滚动到指定位置
        scrollToLeftTarget("exitence",exitence.__key)
        //左侧界面聚焦
        focusOnLeftPage(exitence.__key,"all-exitence",showLeft)
        //显示在主页面
        showTargetOnMain({
            type:"exitence",
            target:exitence
        })
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
            if(!status)return false;
            status.value = newName
        }
    }
    // 改变事物别名
    export function changeExitenceNickName(exitence:Exitence,newNickName:string[]){
        //改变输入建议中的别名
        changeExitenceInputSuggestion(exitence.__key,"nickName",newNickName)
    }

    /**
     * 判断一个事物是否具备某个或某些属性对象
     * @param exitence 
     * @param status 允许传入一个数组，只有在事物具备其中所有属性时才会返回真 
     * @returns 返回布尔值
     */
    export function ifExitenceHaveStatus(exitence:Exitence,statusList:Status[]|Status){
        //是数组
        if(isArray(statusList)){
            //遍历列表,要求事物具备其中每一个属性
            return statusList.every((status)=>{
                //若事物的任一属性
                return exitence.status.some((tmp)=>{
                    return tmp.__key == status.__key
                })
            })
        }
        //不是数组
        return exitence.status.some((tmp)=>{
            return tmp.__key == statusList.__key
        })
        
    }

    //在弹窗中显示事物对象
    export function showExitenceOnPopUp(type:Type,exitence:Exitence){
        showPopUp({
            vueName:"showExitence",
            buttons:null,
            mask:true,
            props:{
                type,
                exitence
            }
        })
    }
    //判断指定事物是否满足指定分组的规则
    export function ifExitenceInGroup(exitence:Exitence,group:Group){
        return filterExitenceByRule(exitence,group.rules)
    }
    //判断指定事物是否满足任意一个分组的规则
    export function ifExitenceInAnyGroup(exitence:Exitence,groupList:Group[]){
        // 遍历每个分组
        for (const group of groupList) {
            // 如果指定事物符合某个分组的规则，则返回 true
            if (filterExitenceByRule(exitence, group.rules)) {
                return true;
            }
        }
        // 如果没有一个分组符合规则，返回 false
        return false;
    }

    //获取事物的预览内容
    export function getExitencePreview(exitence:Exitence,type:Type){
        const key = exitence.setting?.previewStatus
		if(!key){return ""}
		const status = getExitenceStatusByKey(key,exitence.status,type.typeStatus)
		if(!status){return ""}
		if(status.valueType == "tags"){
			let tmp = ""
			for(let tag of status.value){
				tmp += `[${translateToTextContent(tag)}] `
			}
			return tmp
		}
		const tmp = translateToTextContent(status.value)
		return tmp.slice(0,100)
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
        const newGroup= new Group(name,rules,setting,nanoid(),type.__key)
        type.groups.push(newGroup)
        return newGroup
    }
    // 删除分组，不会删除其中的事物
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
    export function getExitenceInGroup(exitenceList:Exitence[],group:Group){
        //遍历所有事物，获取满足条件的部分
        const tmp = exitenceList.reduce((arr:Exitence[],exitence)=>{
            if(filterExitenceByRule(exitence,group.rules)){
                arr.push(exitence)
            }
            return arr
        },[])
        return tmp
    }
    // 获取指定分类中，没有满足任何分组规则的事物
    export function getNoGroupExitence(exitenceList:Exitence[],groups:Group[]){
        //让所有事物分别遍历一次分组规则，返回没有满足任何一个规则的事物数组
		const tmp = exitenceList.filter((exitence)=>{
            for(let i=0;i<groups.length;i++){
                const group = groups[i]
                //满足任意一个分组的事物不要
				if(filterExitenceByRule(exitence,group.rules)){
					return false
				}
            }
			return true
		})
		return tmp
    }
    //聚焦指定分组
    export function focusOnGroup(group:Group,showLeft:boolean=true){
        //展开分类
        const type = getTypeByKey(group.typeKey)
        if(!type)throw new Error(`没有找到type${group}`)
        type.expending = true;
        //展开分组
        group.expending = true;
        //左侧页面聚焦
        focusOnLeftPage(group.__key,"all-exitence",showLeft)
        //滚动
        scrollToLeftTarget("group",group.__key)
    }
