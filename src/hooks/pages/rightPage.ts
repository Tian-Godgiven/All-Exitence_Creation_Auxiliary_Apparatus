import { RightAbility, RightAbilityGroupName, rightAbilityList } from "../../static/list/rightAbilityList";

//添加到右侧能力列表中
export function addToRightPage(ability: RightAbility, groupName:RightAbilityGroupName) {
    const group = rightAbilityList.value[groupName]
    if(group){
        group.push(ability)
    }
    else{
        rightAbilityList.value[groupName] = [ability]
    }
}
