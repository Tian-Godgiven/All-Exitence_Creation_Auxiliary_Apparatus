import { addInputLastDiv, deleteInputLast, getInputPosition } from "@/api/cursorAbility";
import { addInputLast } from "@/api/cursorAbility"
import { ref } from "vue";

export interface suggestionItem{
    text:string,
    showText?:string,
    type:string,
    info?:string,
    click?:(input:string,item:suggestionItem)=>void,
    target?:any
}

// 输入提示的内容
export const content = ref<suggestionItem[]>([])
export const ifShow = ref(false)
export const positionCSS = ref({left:0,top:0})
export const inputText = ref("") //已经输入了的内容

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