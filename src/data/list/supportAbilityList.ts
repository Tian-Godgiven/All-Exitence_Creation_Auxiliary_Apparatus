import { initMissionList } from "@/supportAbility/missionList/missionList";

export const initSupportAbilityList:{
    name:string,
    init:()=>void
}[] = [
    {
        name:"missionList",
        init:()=>initMissionList()
    }
]