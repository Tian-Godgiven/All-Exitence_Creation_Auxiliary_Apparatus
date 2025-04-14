import { divWeakMap } from "@/api/cursorAbility";
import { getExitenceStatusByKey, nowAllExitence } from "@/hooks/all-exitence/allExitence";
import { showPopUp } from "@/hooks/pages/popUp";
import { jumpExitenceDivStyle } from "@/static/style/exitenceDivStyle"
import { isArray } from "lodash";

//跳转Div所使用到的数据对象
export type JumpData = { 
    type:string,//跳转类型
    text:string,
    target:string[], //跳转目标
    info?:string//跳转div信息，目前仅用于提示该div存储事物别名
}
export type ExitenceJumpData = {
    type:string,//跳转类型
    text:string,
    target:string[], //跳转目标
    nickName?:boolean, //该跳转对象是否为别名

}


//跳转div的html内容
export function jumpDivHtml(data:any){
    const inner = getJumpDivInner(data)
    if(inner == false){return false}
    //创建一个跳转div的html
    const tmp = `<span style = "${jumpExitenceDivStyle}" 
                contenteditable="false" 
                class="jumpDiv">${inner}</span>`
    return tmp
    // 获取跳转div的内容
    function getJumpDivInner(data:any):string|boolean{
        const {target,type} = data;
        //如果type为exitence
        if(type == "exitence"){
            const result = findExitenceByTarget(target)
            if(!result){return false}
            const {exitence,type} = result
            //查看其设置项1:是否强制修改跳转内容
            const setting:any = {...type?.setting,...exitence?.setting}
            const tmp = setting?.autoCompleteText
            if(tmp && tmp != ""){
                return tmp
            }
            //设置项2：是否启用别名填充跳转内容
            const tmp2 = setting?.autoCompleteNickName
            if(tmp2 == true && data?.nickName == true){
                //判断该别名是否存在于别名属性中
                const statusKey = setting?.nickName
                const status = getExitenceStatusByKey(statusKey,exitence.status,type.typeStatus)
                if(!status)return false;
                if(isArray(status.value) && status.value.includes(data.text)){
                    return data.text
                }
            }
            //返回事物的名称
            return exitence.name
        }
        console.error("文本数据中的type类型有误，不属于已知类型")
        return false

    }
}

// 跳转功能：点击一个class为jumpDiv的div，将跳转至该div指向的目标
document.addEventListener("click",(event)=>{
    const targetElement = event.target as HTMLElement;
    // 检查是否点击了 class 为 jumpDiv 的 div
    if (targetElement && targetElement.classList.contains("jumpDiv")) {
        // 获取该 div 绑定的跳转类型和跳转目标
        const data = divWeakMap.get(targetElement) as JumpData
        const {target,type} = data
        if(!target || !type){
            console.error("错误，跳转div没有成功绑定跳转目标或跳转类型：",targetElement)
            return false
        }

        //根据挑战目标的类型调用不同的跳转函数
        if(type == "exitence"){
            //跳转到事物对象
            jumpToExitence(target)
        }
        
    }
})

// 跳转到事物对象
export function jumpToExitence(target:any[]){
    const result = findExitenceByTarget(target)
    if(result){
        showPopUp({
            vueName:"showExitence",
            buttons:[],
            mask:true,
            "props":{
                ...result
            }
        })
    }
}

function findExitenceByTarget(target:any[]){
    const [typeKey,exitenceKey] = target
    //寻找这个事物对象和其所在的type
    const type = nowAllExitence.types.find((type)=>type.__key==typeKey)
    const exitence = type?.exitence.find((exitence)=>exitence.__key==exitenceKey)
    // 显示这个事物
    if(type && exitence){
        return {type,exitence}
    }
    else{
        return false
    }
}

//判断是否是一个跳转div
export function isJumpDiv(node:Node):node is HTMLElement{
    return node instanceof HTMLElement && node.classList.contains("jumpDiv")

}


