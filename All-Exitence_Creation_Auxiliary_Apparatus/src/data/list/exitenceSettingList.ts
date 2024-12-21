import Status from "@/interfaces/exitenceStatus"

export interface exitenceSetOption{
    name:string, //设置项名称 aka 关键字
    value?:any, //设置项值，不为空时，其为默认值
    text:string, //设置项文本
    type:'checkBox' | 'input' |'choose', //设置项类型
    select?:(status:Status)=>boolean, //设置项筛选条件
    confrimValue?:(value:any)=>boolean  //设置项值确认条件
    inputs?:any, //输入性设置项的内容
    choices?:any[], //选项性设置项的选项
}

// 属性设置的内容项表
export let exitenceSettingList:exitenceSetOption[] = [
    {
        name:"测试1",
        text:"测试内容1",
        type:'checkBox'
    },
    {
        name:"测试2",
        text:"测试内容2",
        type:'checkBox'
    },
    {
        name:"测试3",
        text:"测试内容3",
        type:'checkBox'
    }
]
