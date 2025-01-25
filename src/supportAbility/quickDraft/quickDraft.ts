import { addToRightPage } from "@/hooks/pages/rightPage"
import { TextAreaContent } from "@/hooks/expression/textAreaContent"
import { createFileToPath, readFileFromPath } from "@/hooks/fileSysytem"
import { showPopUp } from "@/hooks/pages/popUp"
import { reactive, shallowRef } from "vue"
import QuickDraft from "./popUp/quickDraft.vue"

export type QuickDraftItem = {
    inner:TextAreaContent[],
    time:number
}
export type QuickDraft = QuickDraftItem[]

//初始化:添加按键即可，切换项目的同时会切换至对应的暂记版
export const nowQuickDraft = reactive<QuickDraft>([])
export async function initQuickDraft(){
    //添加右侧功能按键
    addToRightPage({
        "iconName":"quickDraft",
        "click":()=>showQuickDraftPopUp(),
        "name":"暂记版"
    })
}
//保存
export function saveQuickDraft(){

}
//创建暂记版
export async function createQuickDraft(projectPath:string){
    //在项目的data中创建暂记版对象
    const dataPath = projectPath+"/data"
    await createFileToPath(dataPath,"quickDraft.json",JSON.stringify([]))
}
//切换暂记版
export async function changeQuickDraft(projectPath:string){
    //切换到对应项目的暂记版
    const dataPath = projectPath+"/data"
    let tmp = await readFileFromPath(dataPath,"quickDraft.json")
    //若读取失败则创建一个新的暂记版对象
    if(!tmp){
        createQuickDraft(projectPath)
        tmp = []
    }
    //切换当前暂记版
    Object.assign(nowQuickDraft,tmp)
}

//显示暂记版弹窗
export async function showQuickDraftPopUp(){
    showPopUp({
        vue:shallowRef(QuickDraft),
        "buttons":null,
        "mask":true,
    })
}