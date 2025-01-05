import { Type } from "@/class/Type"
import Status from "@/interfaces/exitenceStatus"
import { SettingOption } from "@/interfaces/SettingOption"

// 属性设置的内容项表
export let typeSettingList:SettingOption<Type>[] = [
    {
        name:"noDefaultTags",
        text:"不为事物创建默认的标签属性",
        type:'checkBox',
        value:false,
    },
    {
        name:"syncWithName",
        text:"指定输入类属性值与事物名称同步",
        type:'choose',
        choices:(type:Type)=>{
            //返回输入类属性组成的对象列表
            const allStatus = type.typeStatus
            const tmpList:any[] = []
            allStatus.forEach((status:Status)=>{
                if(["downLine","inputBox"].includes(status.valueType)){
                    tmpList.push({value:status.__key,text:status.name})
                }
            })
            return tmpList
        }
    },
    {
        name:"showPreview",
        text:"指定属性值作为事物预览内容",
        type:'choose',
        choices:(type:Type)=>{
            const allStatus = type.typeStatus
            const tmpList:any[] = []
            allStatus.forEach((status:Status)=>{
                tmpList.push({value:status.__key,text:status.name})
            })
            return tmpList
        }
    },
    {
        name:"nickName",
        text:"指定标签类属性值为事物的别名",
        type:"choose",
        choices:(type:Type)=>{
            const allStatus = type.typeStatus
            const tmpList:any[] = []
            allStatus.forEach((status:Status)=>{
                //返回tags类属性
                if(status.valueType == "tags"){
                    tmpList.push({value:status.__key,text:status.name})
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
