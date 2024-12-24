import { addInputLastDiv, deleteInputLast, getInputPosition } from "@/api/cursorAbility";
import { addInputLast } from "@/api/cursorAbility"
import { Exitence } from "@/class/Exitence";
import { Type } from "@/class/Type";
import { exitenceDivStyle } from "@/data/list/exitenceDivStyle";
import globalInputSuggestionListData from "@/data/list/globalInputSuggestionList.json";
import { types } from "@/hooks/all-exitence/allExitence";
import { showPopUp } from "@/hooks/popUp";
import { projectInputSuggestionListData } from "@/hooks/project/projectData";
import { computed, ref, shallowReactive } from "vue";

export interface suggestionItem{
    text:string,
    showText?:string,
    type:string,
    info?:string,
    click?:(input:string,item:suggestionItem)=>void, //点击该输入提示项的事件
    target?:any
}

const globalInputSuggestionList = shallowReactive(globalInputSuggestionListData)
const projectInputSuggestionList = shallowReactive(projectInputSuggestionListData)

// 输入提示的内容
export const content = ref<suggestionItem[]>([])
export const ifShow = ref(false)
export const positionCSS = ref({left:0,top:0})
export const inputText = ref("") //已经输入了的内容


// 在应用中使用的输入提示表=项目内的输入提示表+全局输入提示表
export const inputSuggestionList = computed(()=>{
    //读取项目和全局的输入提示表数据信息，并进行处理：为其添加点击事件
    const projectTmp = completeListData(projectInputSuggestionList)
    const globalTmp = completeListData(globalInputSuggestionList)

    return [...projectTmp,...globalTmp]
    //处理原始的输入建议数据列表，返回完善的输入建议列表对象
    function completeListData(listData:any[]){
        return listData.reduce((arr:any[],item:suggestionItem)=>{
            let click = getSuggetionItemClick(item.type)
            arr.push({...item,click})
            return arr
        },[])
    }
})

//不同类型的输入提示对象的点击事件
function getSuggetionItemClick(type:string){
    let click
    switch(type){
        //字符串自动补全
        case "string":
            click = (input:string,item:suggestionItem)=>{
                autoComplete(input,item.text)
            }
            break
        //事物补全div并进行关联
        case "exitence":
            click = (input:string,item:suggestionItem)=>{
                const domHTML = `<span style = "${exitenceDivStyle}" contenteditable="false" class="jumpExitence" data-exitence="${item.target}">${item.text}</span>`
                autoCompleteDom(input,domHTML)
            }
            break;
        default:
            console.error("错误：未定义的输入建议类型")
    }
    return click
}



//向输入提示表中新增内容
export function addInputSuggestion(item:suggestionItem,targetExitence?:Exitence,position?:"global"|"project"){
    //若类型为exitence，则提取其中的目标事物的__key
    if(item.type == "exitence"){
        if(targetExitence){
            item["target"] = targetExitence.__key
        }
        else{
            console.error("错误：未传入输入提示指向的事物对象")
        }
    }
    
    //若没有指定输入提示表位置，则根据item的类型判断
    if(!position){
        if(item.type == "exitence"){
            position = "project"
        }
        else{
            position = "global"
        }
    }

    //获取目标列表
    const list:suggestionItem[] = (position == "global"? globalInputSuggestionList : projectInputSuggestionList)
    //向list中添加item内容
    list.push({...item})
}

// 在指定位置显示输入提示
export function showInputSuggestion(input:string,suggestionContent:suggestionItem[],position?:any){
    ifShow.value = true;
    content.value = suggestionContent
    inputText.value = input //已经输入的内容
    if(position){
        positionCSS.value = position
    }
    else{
        const tmp = getInputPosition()
        if(tmp){
            positionCSS.value = tmp
        }
    }
}

// 隐藏输入提示 
export function hideInputSuggestion(){
    ifShow.value = false
}

// 判断是否需要输入提示
export function checkInputSuggestion(inputSuggestionList:suggestionItem[],input:string){
    if(input == ""){
        return false
    }
    //如果input在inputSuggestionList中则返回这些内容
    const tmp:[] = inputSuggestionList.reduce((arr,item)=>{
        if(item.text.startsWith(input)){
            arr.push(item)
        }
        return arr
    },<any>[])
    
    if(tmp.length > 0){
        return tmp
    }
    else{
        return false
    }
}

// 补全功能: 在当前光标后补全text的内容
export function autoComplete(input:string,text:string){
    //需要补充的内容
    const completeText = text.slice(input.length)
    //向当前光标后添加这些内容
    addInputLast(completeText)
}

// 补全功能：补全一个dom对象
export function autoCompleteDom(input:string,domHTML:string){
    //先删除input内容
    deleteInputLast(input.length)
    //再添加dom对象
    addInputLastDiv(domHTML)
}

// 跳转功能：点击一个class为jumpExitence的div，显示该div指向的事物
document.addEventListener("click",(event)=>{
    const targetElement = event.target as HTMLElement;
    // 检查是否点击了 class 为 jumpExitence 的 div
    if (targetElement && targetElement.classList.contains("jumpExitence")) {
        // 获取该 div 的 data-target 属性值
        const target = targetElement.getAttribute("data-exitence");
        if(!target){
            console.error("错误，不存在的事物标识符：",targetElement)
            return false
        }
        // 调用 showJumpExitence 函数来显示相关内容
        showJumpExitence(target);
    }
})
export function showJumpExitence(exitenceKey:string){
    //寻找这个事物对象和其所在的type
    const result = types.reduce((acc:any, type: Type) => {
        if (acc) return acc;  // 已经找到了，不需要继续查找
        const exitence = type.exitence.find((exitence: Exitence) => exitence.__key === exitenceKey);
        if (exitence) {
            return { type, exitence };  // 找到匹配的 exitence，返回包含 type 和 exitence 的对象
        }
        return null;  // 没有找到，继续查找
    }, null);
    console.log(result)
    const {type,exitence} = result



    

    if(exitence){
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