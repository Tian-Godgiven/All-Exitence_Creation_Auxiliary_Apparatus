import { Exitence, ExitenceStatus } from "@/class/Exitence"
import { Type } from "@/class/Type"
import { changeExitenceName, changeExitenceNickName, getExitenceStatusByKey } from "@/hooks/all-exitence/allExitence"
import { SettingOption } from "@/components/all-exitence/setting/setting"

// 属性设置的内容项表
export let exitenceSettingList:SettingOption<Exitence>[] = [{
    name:"syncWithName",
    text:"指定输入类属性值与事物名称同步",
    type:'choose',
    choices:(exitence:Exitence,type:Type)=>{
        //返回事物的输入类属性组成的对象列表
        const allStatus = exitence.status
        const tmpList = allStatus.flatMap((status:ExitenceStatus)=>{
            const fullStatus = getExitenceStatusByKey(status.__key,allStatus,type.typeStatus)
            if(fullStatus && ["input","inputBox"].includes(fullStatus.valueType)){
                return {value:status.__key,label:fullStatus.name}
            }
            return []
        })
        return tmpList
    },
    change:(oldValue:string,newValue:string,exitence:Exitence)=>{
        //将旧的属性的setting去除
        const oldStatus = getExitenceStatusByKey(oldValue,exitence.status)
        if(oldStatus && oldStatus.setting){
            delete oldStatus.setting["exitenceSetting-syncWithName"]
        }
        //给新的属性这个setting,值为事物和分类的key数组
        if(!newValue){return;}
        const newStatus = getExitenceStatusByKey(newValue,exitence.status)
        if(!newStatus)return;
        newStatus.setting ??= {}
        newStatus.setting["exitenceSetting-syncWithName"] = [exitence.typeKey,exitence.__key]
        changeExitenceName(exitence,newStatus.value)
    }
},
{
    name:"previewStatus",
    text:"指定属性值作为事物预览内容",
    type:'choose',
    choices:(exitence:Exitence,type:Type)=>{
        //返回事物的输入类或标签类属性组成的对象列表
        const allStatus = exitence.status
        const tmpList = allStatus.flatMap((status:ExitenceStatus)=>{
            const theStatus = getExitenceStatusByKey(status.__key,allStatus,type.typeStatus)
            if(theStatus && ["tags","inputBox","input"].includes(theStatus.valueType)){
                return {value:status.__key,label:theStatus.name}
            }
            return []
        })
        return tmpList
    }
},{
    name:"nickName",
    text:"指定标签类属性值为事物的别名",
    type:"choose",
    choices:(exitence:Exitence,type:Type)=>{
        //返回事物的输入类或标签类属性组成的对象列表
        const allStatus = exitence.status
        const tmpList = allStatus.flatMap((status:ExitenceStatus)=>{
            const fullStatus = getExitenceStatusByKey(status.__key,allStatus,type.typeStatus)
            if(fullStatus && fullStatus.valueType == "tags"){
                return {value:status.__key,label:fullStatus.name}
            }
            return []
        })
        return tmpList
    },
    change:(oldValue,newValue,exitence)=>{
        //将旧的属性的setting去除
        const oldStatus = getExitenceStatusByKey(oldValue,exitence.status)
        if(oldStatus && oldStatus.setting){
            delete oldStatus.setting["exitenceSetting-nickName"]
        }
        //给新的属性这个setting,值为事物和分类的key数组
        if(!newValue)return;
        const newStatus = getExitenceStatusByKey(newValue,exitence.status)
        if(!newStatus)return;
        newStatus.setting ??= {}
        newStatus.setting["exitenceSetting-nickName"] = [exitence.typeKey,exitence.__key]
        //改变事物的别名为目标属性值
        changeExitenceNickName(exitence,newStatus.value)
    }
},{
    name:"autoCompleteNickName",
    text:"别名的自动补全内容为该别名",
    type:"checkBox",
    value:false,
},{
    name:"autoCompleteText",
    text:"强制修改事物的自动补全内容为：",
    type:"input",
    value:""
}]
