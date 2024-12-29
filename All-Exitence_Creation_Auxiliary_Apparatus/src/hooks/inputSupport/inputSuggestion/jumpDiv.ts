import { divWeakMap } from "@/api/cursorAbility";
import { nowAllExitence } from "@/hooks/all-exitence/allExitence";
import { showPopUp } from "@/hooks/pages/popUp";
import { jumpExitenceDivStyle } from "@/static/style/exitenceDivStyle"

//跳转div的html内容
export function jumpDivHtml(inner:string){
    const tmp = `<span style = "${jumpExitenceDivStyle}" 
                contenteditable="false" 
                class="jumpDiv">
                    ${inner}
                </span>`
    return tmp
}

// 跳转功能：点击一个class为jumpDiv的div，将跳转至该div指向的目标
document.addEventListener("click",(event)=>{
    const targetElement = event.target as HTMLElement;
    // 检查是否点击了 class 为 jumpDiv 的 div
    if (targetElement && targetElement.classList.contains("jumpDiv")) {
        // 获取该 div 绑定的跳转类型和跳转目标
        const data = divWeakMap.get(targetElement)
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


export function jumpToExitence(exitenceFrom:string){
    const [typeKey,exitenceKey] = JSON.parse(exitenceFrom)
    //寻找这个事物对象和其所在的type
    const type = nowAllExitence.types.find((type)=>type.__key==typeKey)
    const exitence = type?.exitence.find((exitence)=>exitence.__key==exitenceKey)
    // 显示这个事物
    if(type && exitence){
        showPopUp({
            vueName:"showExitence",
            buttons:[],
            mask:true,
            "props":{
                exitence,
                type
            }
        })
    }
}

