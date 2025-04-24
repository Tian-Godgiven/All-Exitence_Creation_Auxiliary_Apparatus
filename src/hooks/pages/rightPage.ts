import { RightAbility, RightAbilityGroupName, rightAbilityList } from "../../static/list/rightAbilityList";

/**
 * 
 * @param ability 注意使用路径时，应当是如下结构：“总文件夹名/图标文件夹名/图标名”
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
