import { addToRightPage } from "@/hooks/pages/rightPage"
import { TextAreaContent } from "@/hooks/expression/textAreaContent"
import { tryReadFileAtPath, writeFileAtPath } from "@/hooks/fileSysytem"
import { showPopUp } from "@/hooks/pages/popUp"
import { reactive, ref, shallowRef, toRaw } from "vue"
import QuickDraft from "./popUp/QuickDraft.vue"
import { nanoid } from "nanoid"
import FloatWindow from "./popUp/FloatWindow.vue"
import { addFloatWindow, deleteFloatWindow} from "@/hooks/pages/floatWindow"
import { SupportAbilitySignUpItem } from "@/static/list/supportAbilityList"
import { nowProjectInfo } from "@/hooks/project/projectData"

//注册对象
export const quickDraftItem:SupportAbilitySignUpItem = {
    name:"quickDraft",
    init:()=>initQuickDraft(),
    save:()=>saveQuickDraft(),
    syncProject:async(projectPath)=>await changeQuickDraft(projectPath)
}

//类
export type QuickDraftItem = {
    inner:TextAreaContent[],
    time:number,
    __key:string
}
export type QuickDraft = {
    items:QuickDraftItem[],
    setting:{
        focusingItem:string | null,
        floatWindow:{
            show:boolean,
            position:[number,number]
        }
    }
}
//默认对象
const idleQuickDraft:QuickDraft = {
    items:[],
    setting:{
        focusingItem:null,
        floatWindow:{
            show:true,
            position:[100,100]
        }
    }
}

//初始化:添加按键即可，切换项目的同时会切换至对应的暂记版
export const nowQuickDraft = reactive<QuickDraft['items']>([])
export const nowQuickDraftSetting = reactive<QuickDraft['setting']>(idleQuickDraft.setting)
function initQuickDraft(){
    //添加右侧功能按键
    addToRightPage({
        "iconName":"quickDraft",
        "click":()=>showQuickDraftPopUp(),
        "name":"暂记版"
    })
}
//保存
function saveQuickDraft(){
    //保存当前聚焦对象的key
    const focusingKey = focusingItem.value?.__key ?? null
    nowQuickDraftSetting.focusingItem = focusingKey
    //保存设置和item
    const dataPath = `projects/${nowProjectInfo.pathName}/data`
    writeFileAtPath(dataPath,"quickDraft.json",{
        items:toRaw(nowQuickDraft),
        setting:toRaw(nowQuickDraftSetting)
    })
}
//切换暂记版
export async function changeQuickDraft(projectPath:string){
    //切换到对应项目的暂记版
    const dataPath = projectPath+"/data"
    //尝试读取项目暂记版，失败时创建默认暂记版
    let quickDraft:QuickDraft = await tryReadFileAtPath(
        dataPath,"quickDraft.json",true,idleQuickDraft)
    //切换当前暂记版
    nowQuickDraft.length = 0 //清空数组内容
    Object.assign(nowQuickDraft,quickDraft.items)
    Object.assign(nowQuickDraftSetting,quickDraft.setting)
    //读取设置
    const setting = quickDraft.setting
    //读取记录的聚焦暂记对象
    const focusingKey = setting.focusingItem
    if(focusingKey){
        const result = quickDraft.items.find((item)=>item.__key == focusingKey)
        if(result)focusingItem.value = result
    }
    //加载或隐藏悬浮窗
    loadQuickDraftFloatWindow(setting.floatWindow)
}

//显示暂记版弹窗
export async function showQuickDraftPopUp(){
    showPopUp({
        vue:shallowRef(QuickDraft),
        "buttons":null,
        "mask":true,
    })
}
//加载暂记版悬浮窗
export let floatWindowKey = ref<string|null>(null)
export function loadQuickDraftFloatWindow(floatWindowSetting:QuickDraft["setting"]["floatWindow"]){
    //显示:在app中添加悬浮窗
    if(floatWindowSetting.show && floatWindowKey.value==null){
        floatWindowKey.value = addFloatWindow(FloatWindow)
    }
    //隐藏:将已有的悬浮窗删除
    else if(!floatWindowSetting.show && floatWindowKey.value){
        deleteFloatWindow(floatWindowKey.value)
        floatWindowKey.value = null
    }
}
//控制悬浮窗的显示与否
export function switchQuickDraftFloatWindow(show?:boolean,position?:[number,number]){
    //修改设置项
    if(show==null){
        show = !nowQuickDraftSetting.floatWindow.show
    }
    nowQuickDraftSetting.floatWindow.show = show
    if(!position){position = nowQuickDraftSetting.floatWindow.position}
    else{
        nowQuickDraftSetting.floatWindow.position = position
    }
    //重新加载悬浮窗
    loadQuickDraftFloatWindow(nowQuickDraftSetting.floatWindow)
}
//控制悬浮窗的折叠与否
export const foldFloatWindow = ref(true)
export function switchFoldFloatWindow(bool?:boolean){
    if(bool!=null)foldFloatWindow.value = bool
    else{
        foldFloatWindow.value = !foldFloatWindow.value
    }
}


//创建暂记块
export function createQuickDraftItem(){
    const quickDraftItem:QuickDraftItem = {
        inner:[""],
        time:Date.now(),
        __key:nanoid()
    }
    return quickDraftItem
}
//添加暂记快
export function addQuickDraftItem(item:QuickDraftItem,index?:number){
    if(!index){
        nowQuickDraft.push(item)
        return;
    }
    nowQuickDraft.splice(index,0,item)
}
//删除暂记块
export function deleteQuickDraftItem(item:QuickDraftItem){
    const index = nowQuickDraft.indexOf(item)
    if(index > -1){
        nowQuickDraft.splice(index,1)
    }
}

//显示聚焦页面
export const ifFocusing = ref(false)
export const focusingItem = ref<QuickDraftItem|null>(null)
export function showFocusingPage(item?:QuickDraftItem){
    ifFocusing.value = true
    if(item){
        focusingItem.value = item
    }
}