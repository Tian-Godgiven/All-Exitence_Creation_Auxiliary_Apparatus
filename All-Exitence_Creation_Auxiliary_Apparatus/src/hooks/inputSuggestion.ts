import { getInputPosition } from "@/api/getInputPosition";
import { suggestionItem } from "@/data/list/checkList/keyWorkList";
import { ref } from "vue";

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
export function checkInputSuggestion(checkList:suggestionItem[],input:string){
    if(input == ""){
        return false
    }
    //如果input在checkList中则返回这些内容
    const tmp:[] = checkList.reduce((arr,item)=>{
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