import { Exitence } from "@/class/Exitence"
import { Type } from "@/class/Type"
import { getExitenceStatusByKey } from "@/hooks/all-exitence/allExitence"
import Status from "@/interfaces/exitenceStatus"
import { SettingOption } from "@/interfaces/SettingOption"

// 属性设置的内容项表
export let exitenceSettingList:SettingOption<Exitence>[] = [
    {
        name:"syncWithName",
        text:"指定输入类属性值与事物名称同步",
        type:'choose',
        choices:(exitence:Exitence,type:Type)=>{
            //返回事物的输入类属性组成的对象列表
            const allStatus = exitence.status
            const tmpList:any[] = []
            allStatus.forEach((status:Status)=>{
                const statusValue = getExitenceStatusByKey(status.__key,allStatus,type.typeStatus)
                if(["downLine","inputBox"].includes(statusValue.valueType)){
                    tmpList.push({value:status.__key,text:statusValue.name})
                }
            })
            return tmpList
        }
    },
    {
        name:"showPreview",
        text:"指定属性值作为事物预览内容",
        type:'choose',
        choices:(exitence:Exitence,type:Type)=>{
            //返回事物的所有属性组成的对象列表
            const allStatus = exitence.status
            const tmpList:any[] = []
            allStatus.forEach((status:Status)=>{
                const statusValue = getExitenceStatusByKey(status.__key,allStatus,type.typeStatus)
                tmpList.push({value:status.__key,text:statusValue.name})
            })
            return tmpList
        }
    },
    {
        name:"noDefaultTags",
        text:"不创建默认的标签属性",
        type:'checkBox',
        value:false,
    },{
        name:"nickName",
        text:"指定标签类属性值为事物的别名",
        type:"choose",
        choices:(exitence:Exitence,type:Type)=>{
            //返回事物的所有tags类属性组成的对象列表
            const allStatus = exitence.status
            const tmpList:any[] = []
            allStatus.forEach((status:Status)=>{
                const statusValue = getExitenceStatusByKey(status.__key,allStatus,type.typeStatus)
                if(statusValue.valueType == "tags"){
                    tmpList.push({value:status.__key,text:statusValue.name})
                }
            })
            return tmpList
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
    }
]
