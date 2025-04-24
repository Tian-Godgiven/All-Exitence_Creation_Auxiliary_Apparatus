import { RightAbility, RightAbilityGroupName, rightAbilityList } from "../../static/list/rightAbilityList";

/**
 * 
 * @param ability
 * @param groupName 
 */
export function addToRightPage(ability: RightAbility, groupName:RightAbilityGroupName) {
    const group = rightAbilityList.value[groupName]
    if(group){
        group.push(ability)
    }
    else{
        rightAbilityList.value[groupName] = [ability]
    }
}
