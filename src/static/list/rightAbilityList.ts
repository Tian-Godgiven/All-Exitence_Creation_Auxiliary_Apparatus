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
}

export const rightAbilityList:Ref<RightAbilityGroup> = ref({
    "创作计划":[],
    "灵感迸发":[],
    "客制化":[],
    "可视化":[],
    "其他":[]
})

