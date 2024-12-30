import { addInputLastDiv, deleteInputLast, getInputPosition } from "@/api/cursorAbility";
import { addInputLast } from "@/api/cursorAbility"
import { globalInputSuggestionList } from "@/hooks/app/globalInputSuggestion";
import { projectInputSuggestionList } from "@/hooks/project/projectData";
import { computed, ref } from "vue";
import { jumpDivHtml } from "./jumpDiv";
import { Type } from "@/class/Type";
import { Exitence } from "@/class/Exitence";

//输入建议单元
export interface suggestionItem{
    text:string,
    showText?:string,
    type:"string"|"exitence",
    info?:string,
    click?:(input:string,item:suggestionItem)=>void, //点击该输入提示项的事件
    target?:string 
}

// 输入提示的内容
export const content = ref<suggestionItem[]>([])
// 是否显示输入提示
export const ifShow = ref(false)
// 输入提示的位置
export const positionCSS = ref({left:0,top:0})
//已经输入了的内容
export const inputText = ref("")
// 完成输入提示时的回调事件
export const onInputSuggestion = ref(()=>{})

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

//根据输入提示对象的类型，为对应的输入提示div提供点击事件
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
                if(!item.target){
                    console.error("这个输入提示对象不具备有效的目标值：",item)
                    return false
                }
                //自动补全一个跳转div
                autoCompleteJumpDiv(input,item.target,"exitence",item.text)
            }
            break;
        default:
            console.error("错误：未定义的输入建议类型")
    }
    return click
}


//向输入提示表中新增内容
export function addInputSuggestion(item:suggestionItem,position?:"global"|"project"){
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

//新增事物类型的输入提示
export function addExitenceInputSuggestion(type:Type,exitence:Exitence){
    //事物类型的跳转对象是其type和exitence的key组成的数组
    const target = [type.__key,exitence.__key]
    const item:suggestionItem = {
        text:exitence.name,
        type:"exitence",
        info:"创建的事物",
        target:JSON.stringify(target)
    }
    //添加这样一个item
    addInputSuggestion(item,"project")
}

// 在指定位置显示输入提示
export function showInputSuggestion(tmp:{
    input:string,
    suggestionContent:suggestionItem[],
    onInputSuggestion?:()=>void,
    position?:any
}){
    ifShow.value = true;
    content.value = tmp.suggestionContent
    inputText.value = tmp.input //已经输入的内容
    if(tmp.onInputSuggestion){
        onInputSuggestion.value = tmp.onInputSuggestion
    }
    if(tmp.position){
        positionCSS.value = tmp.position
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

// 补全：补全一个跳转div
export function autoCompleteJumpDiv(input:string,target:any,type:string,inner:string){
    //获取跳转div的html
    const domHTML = jumpDivHtml(inner)
    //绑定在跳转div上的data
    const data = {
        type,
        target
    }
    //先删除input内容
    deleteInputLast(input.length)
    //再添加dom对象
    addInputLastDiv(domHTML,null,data)
}
