import { showPopUp } from "@/hooks/pages/popUp";
import { Icon } from "./iconList";
import { Ref, ref } from "vue";

export type RightAbilityGroupName = 
    "创作计划"|
    "灵感迸发"|
    "客制化"|
    "可视化"|
    "其他"

export type RightAbilityGroup = Record<RightAbilityGroupName,RightAbility[]>

export type RightAbility = {
    name:string,
    click:()=>void,
    iconName:Icon
}|{
    name:string,
    click:()=>void,
    iconSrc:string,
}

export const rightAbilityList:Ref<RightAbilityGroup> = ref({
    "创作计划":[
        {
            name:"创作日历",
            click(){
                showPopUp({
                    vueName:"canlendar",
                    mask:true,
                    buttons:[]
                })
            },
            iconName:"canlendar"
        },
    ],
    "灵感迸发":[],
    "客制化":[],
    "可视化":[],
    "其他":[]
})

