import { showPopUp } from "@/hooks/pages/popUp";
import { Icon } from "./iconList";
import { Ref, ref } from "vue";

export type RightAbility = {
    name:string,
    click:()=>void,
    iconName:Icon
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

