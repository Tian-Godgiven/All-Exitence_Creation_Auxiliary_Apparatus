import { showPopUp } from "@/hooks/pages/popUp";
import { Icon } from "./iconList";
import { Ref, ref } from "vue";

//默认的分类名
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
    icon:Icon
}|{
    name:string,
    click:()=>void,
    iconPath:string,
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
            icon:"canlendar"
        },
    ],
    "灵感迸发":[],
    "客制化":[],
    "可视化":[],
    "其他":[]
})

