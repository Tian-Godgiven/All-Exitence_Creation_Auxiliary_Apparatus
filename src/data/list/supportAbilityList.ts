import { initGlobalInputSuggestion, saveGlobalInputSuggestion } from "@/supportAbility/inputSuggestion/globalInputSuggestion";
import { initMissionList, saveMissionList } from "@/supportAbility/missionList/missionList";

export const supportAbilityList:{
    name:string,
    init:()=>void,
    save:()=>void
}[] = [
    {
        name:"inputSuggestion",
        init:()=>{
            initGlobalInputSuggestion()
        },
        save:()=>{
            saveGlobalInputSuggestion()
        }
    },
    {
        name:"missionList",
        init:()=>initMissionList(),
        save:()=>saveMissionList()
    }
]