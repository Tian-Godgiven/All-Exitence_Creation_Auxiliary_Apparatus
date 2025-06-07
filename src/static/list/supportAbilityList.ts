import { customTimeItem } from "@/supportAbility/customTime/customTime";
import { inputSuggestionSighUpItem } from "@/supportAbility/inputSuggestion/main";
// import { missionListItem } from "@/supportAbility/missionList/missionList";
import { quickDraftItem } from "@/supportAbility/quickDraft/quickDraft";
import { searchSighUpItem } from "@/supportAbility/search/search";
import { tagLibrarySignUpItem } from "@/supportAbility/tagLibrary/tagLibrary";
// import { timeLineSignUpItem } from "@/supportAbility/timeLine/timeLine";

export type SupportAbilitySignUpItem = {
    name:string,
    init:()=>void,  //软件初始化时触发的事件
    createProject?:(projectPath:string)=>Promise<void>, //创建新项目时触发的事件
    syncProject?:(projecyPath:string)=>Promise<void>,//同步/移动到项目时触发的事件
    save?:(projectName:string|null)=>void, //软件保存时触发的事件
    call?:()=>void //软件响应指定名称的辅助功能时触发的事件,
}

export const supportAbilityList:SupportAbilitySignUpItem[] = [
    inputSuggestionSighUpItem,
    // missionListItem,待完成
    quickDraftItem,
    customTimeItem,
    // timeLineSignUpItem,待完成
    searchSighUpItem,
    tagLibrarySignUpItem
]