import { Icon } from "./iconList";
import { Ref, ref } from "vue";

export type RightAbility = {
    key:string,
    name:string,
    click:()=>void,
    icon:Icon
}

export const rightAbilityList:Ref<RightAbility[]> = ref([])

