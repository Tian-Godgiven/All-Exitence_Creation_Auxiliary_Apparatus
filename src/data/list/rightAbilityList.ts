import { showPopUp } from "@/hooks/pages/popUp";
import { ButtonIcon } from "./buttonIconList";
import { Ref, ref } from "vue";

export type RightAbility = {
    name:string,
    click:()=>void,
    iconName:ButtonIcon
}|{
    name:string,
    click:()=>void,
    iconSrc:string,
}

export const rightAbilityList:Ref<RightAbility[]> = ref([
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
])

