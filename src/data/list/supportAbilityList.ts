import { createFileToPath, readFileFromPath } from "@/hooks/fileSysytem";
import { createInputSuggestionList } from "@/hooks/inputSupport/inputSuggestion/inputSuggestion";
import { projectInputSuggestionListData } from "@/hooks/project/projectData";
import { initGlobalInputSuggestion, saveGlobalInputSuggestion } from "@/supportAbility/inputSuggestion/globalInputSuggestion";
import { missionListItem } from "@/supportAbility/missionList/missionList";
import { quickDraftItem } from "@/supportAbility/quickDraft/quickDraft";

export type SupportAbilitySignUpItem = {
    name:string,
    init:()=>void,  //软件初始化时触发的事件
    createProject?:(projectPathName:string)=>void, //创建新项目时触发的事件
    syncProject?:(projecyPathName:string)=>void,//同步/移动到项目时触发的事件
    save?:()=>void, //软件保存时触发的事件
    call?:()=>void //软件响应指定名称的辅助功能时触发的事件,
}

export const supportAbilityList:SupportAbilitySignUpItem[] = [
    {
        name:"inputSuggestion",
        init:()=>{initGlobalInputSuggestion()},
        save:()=>{saveGlobalInputSuggestion()},
        createProject:async(pathName)=>{
            //在data中创建相应的文件
            const dataPath = pathName+"/data"
            const list = createInputSuggestionList()
            await createFileToPath(dataPath,"inputSuggestionList.json",JSON.stringify(list))
        },
        syncProject:async(pathName)=>{
            const dataPath = pathName+"/data"
            const inputSuggestionList = await readFileFromPath(dataPath,"inputSuggestionList.json")
            Object.assign(projectInputSuggestionListData,inputSuggestionList)
        }
    },
    missionListItem,
    quickDraftItem,
]