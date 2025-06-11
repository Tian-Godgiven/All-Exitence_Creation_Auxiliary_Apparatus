import { showPopUp } from "@/hooks/pages/popUp";
import { addToRightPage } from "@/hooks/pages/rightPage";
import { SupportAbilitySignUpItem } from "@/static/list/supportAbilityList";
import { reactive, shallowRef } from "vue";
import ManagePage from "./ManagePage.vue";
import { supportAbilitySaveProject, supportAbilitySyncProject } from "@/hooks/app/supportAbility";
import { nanoid } from "nanoid";
import { showQuickInfo } from "@/api/showQuickInfo";

//名称
const spName = "tagLibrary"
//注册对象
export const tagLibrarySignUpItem:SupportAbilitySignUpItem = {
    "name":spName,
    "init":initTagLibrary,
    "syncProject":(projectPath)=>syncTagLibrary(projectPath),
    "save":saveTagLibrary,
    "call":()=>showManagePopUp()
}

//默认内容
const defaultTagLibrary:TagGroup[] = [
    {label:"",__key:"noGroup",tags:[]},
]

export type TagItem = {
    label:string
}
export type TagGroup = {
    label:string,//组名
    __key:string,
    tags:TagItem[]
}
//当前标签库内容
const nowTagLibrary = reactive<TagGroup[]>([])

//初始化：右侧页面按键
function initTagLibrary(){
    addToRightPage({
        "name":"标签库",
        "click":()=>showManagePopUp(),
        "icon":"tagLibrary"
    },"客制化")
}

//同步项目读取相应数据，无文件时也会创建对应项目的标签库文件
async function syncTagLibrary(projectPath:string){
    const file = await supportAbilitySyncProject(spName,projectPath,defaultTagLibrary)
    Object.assign(nowTagLibrary,file)
}
//保存当前数据到项目文件中
async function saveTagLibrary(projectPath:string|null){
    await supportAbilitySaveProject(spName,projectPath,nowTagLibrary)
}

//显示标签库管理弹窗
function showManagePopUp(){
    showPopUp({
        name:"标签库",
        vue:shallowRef(ManagePage),
        buttons:[{
            name:"创建新标签组",
            icon:"addNew",
            click:()=>createTagGroup('新标签组')
        }],
        mask:true
    })
}

//获取当前标签库的内容
export function getTagLibrary(){
    return nowTagLibrary
}

//标签组方法
    //创建/新增
    export function createTagGroup(label:string="",index:number=0){
        const newTagGroup:TagGroup = {
            label,
            __key:nanoid(),
            tags:[]
        }
        //添加到指定index
        nowTagLibrary.splice(index,0,newTagGroup)
    }

    //删除
    export function deleteTagGroup(tagGroup:TagGroup){
        const index = nowTagLibrary.findIndex(group=>group==tagGroup)
        if(index>=0){
            nowTagLibrary.splice(index,1)
        }
    }
//标签对象方法
    //添加
    export function addTagToGroup(tagGroup:TagGroup,tagText:string){
        if(tagText == ""){
            showQuickInfo("无法添加空标签")
            return;
        }
        tagGroup.tags.push({label:tagText})
    }
    //删除
    export function deleteTagFromGroup(tagGroup:TagGroup,tag:string){
        const index = tagGroup.tags.findIndex(value=>value.label==tag)
        if(index>=0){
            tagGroup.tags.splice(index,1)
        }
    }