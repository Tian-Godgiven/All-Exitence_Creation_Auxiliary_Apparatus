import { RightAbility, rightAbilityList } from "../../static/list/rightAbilityList";

//添加到右侧能力列表中
export function addToRightPage(ability: RightAbility) {
    rightAbilityList.value.push(ability);
}
