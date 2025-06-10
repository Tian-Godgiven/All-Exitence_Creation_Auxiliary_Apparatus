import ChooseFromList from "@/components/other/chooseFromList.vue"
import { PopUpSet, showPopUp } from "@/hooks/pages/popUp"
import { shallowRef } from "vue"

export type ChooseFromListProps<T> = {
    list:T[]
    emptyInfo:string,
    info:string,
    chooseNum?:number,
    selectRule:(item:T)=>boolean//该列表中允许显示的项
    showValue?:(item:T)=>string//实际显示的项内容
    returnValue:(itemArr:T[])=>void
}

export function showChooseFromListPopUp<T>(props:ChooseFromListProps<T>,popUpSet?:PopUpSet){
    showPopUp({
        ...popUpSet,
        vue:shallowRef(ChooseFromList),
        props,
    })
}