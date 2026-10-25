import { RightAbility, rightAbilityList } from "../../static/list/rightAbilityList";

/**
 * 
 * @param ability
 */
export function addToRightPage(ability: RightAbility) {
    const existing = rightAbilityList.value.find((item) => item.key === ability.key)
    if(existing) Object.assign(existing, ability)
    else rightAbilityList.value.push(ability)
}
