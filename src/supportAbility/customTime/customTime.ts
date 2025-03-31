import { SupportAbilitySignUpItem } from "@/static/list/supportAbilityList"
import { showPopUp } from "@/hooks/pages/popUp"
import { reactive, ref, shallowRef, toRaw } from "vue"
import Manager from "./popUp/Manager.vue"
import { addToRightPage } from "@/hooks/pages/rightPage"
import { createDirByPath, ifExists, tryReadFileAtPath, writeFileAtPath } from "@/hooks/fileSysytem"
import { showQuickInfo } from "@/api/showQuickInfo"
import { showAlert } from "@/hooks/alert"

//注册自定义时间表达式
export const customTimeItem:SupportAbilitySignUpItem = {
    "name":"customTime",
    "init":()=>initCustomTime(),
    "call":()=>showCustomTimeManager(),
    "save":()=>saveCustomTime()
}

//自定义时间表达式类
export type TimeRule = "date"|CustomTimeRule//地球时间
export type CustomTimeRuleUnit = {
    name:string
    target:string,
    equal:number,
    equalToMin?:number
}|{
    name:string
    target:false //最小单位
}
export type CustomTimeRule ={
    name:string,
    numFormat:"阿拉伯数字"|"简体中文数字"|"繁体中文数字",
    units:[CustomTimeRuleUnit,...CustomTimeRuleUnit[]],
    __key:string
}

//时间表达式库
export const customTimeLib = reactive<CustomTimeRule[]>([])

//初始化
async function initCustomTime(){
    //尝试创建对应文件夹
    const ifExisit = await ifExists("supportAbility","customTime")
    if(!ifExisit){createDirByPath("supportAbility","customTime")}
    //尝试读取时间表达式库
    const tmp = await tryReadFileAtPath(
        "supportAbility/customTime","customTime.json",true,[])
    customTimeLib.length = 0
    Object.assign(customTimeLib,tmp)
    console.log(customTimeLib)
    //注册右侧按钮
    addToRightPage({
        "name":"自定义时间",
        "click":()=>showCustomTimeManager(),
        "iconName":"customTime"
    })
}

//保存
async function saveCustomTime(){
    //保存全局时间表达式
    await writeFileAtPath("supportAbility/customTime","customTime.json",toRaw(customTimeLib))
}

//将自定义时间表达式添加到指定位置
export function addCustomTimeRule(newRule:CustomTimeRule){
    customTimeLib.push(newRule)
    return newRule
}

//删除指定的自定义时间表达式
export function deleteCustomTimeRule(rule:CustomTimeRule){
    showAlert({
        "info":`删除时间表达式${rule.name}?`,
        confirm:()=>{
            const range = customTimeLib
            const index = range.indexOf(rule)
            if(index>=0){
                range.splice(index,1)
            }
        }
    })
    
}

//编辑/修改指定的自定义时间表达式
export function editCustomTimeRule(rule:CustomTimeRule,newRule:CustomTimeRule){
    const index = customTimeLib.indexOf(rule)
    if(index>=0){
        customTimeLib[index] = newRule
    }
}

//检查指定的时间表达式是否符合规范
export function checkCustomTimeRule(rule:CustomTimeRule){
    //名称在范围内不重复
    const name = rule.name
    const range = customTimeLib
    const ifRepeat = range.find((theRule)=>theRule.name == name)
    if(ifRepeat && ifRepeat.__key != rule.__key){
        showQuickInfo(`时间表达式的名称不得重复`)
        return false
    }
    //单位数量不得为0
    const unitList = rule.units
    if(unitList.length == 0){
        showQuickInfo("时间表达式的单位数量不得为0")
        return false
    }
    for(let i = 0;i<unitList.length;i++){
        const unit = unitList[i]
        //所有单位的单位名都存在
        if(unit.name.trim() == ""){
            showQuickInfo(`第${i+1}个单位的名称无效，单位名称不得为空`)
            return false
        }
        //所有单位的目标都存在或为false
        const target = unit.target
        const ifTarget = unitList.find((unit)=>unit.name == target)
        if(target != false && !ifTarget){
            showQuickInfo(`第${i+1}个单位的目标无效，目标不存在于当前规则中`)
            return false
        }
        //不为false时，其equal大于0
        if(target != false && unit.equal <=0){
            showQuickInfo(`第${i+1}个单位的基准值必须大于0`)
            return false
        } 
    }
    return true
        
}
//显示管理页面弹窗
export function showCustomTimeManager(){
    showPopUp({
        vue:shallowRef(Manager),
        buttons:null,
        mask:true
    })
}

//是否显示编辑页面
export const ifShowEditPage = ref(false)
//编辑页面使用的对象
type EditTarget = CustomTimeRule|null
export const editTarget = ref<EditTarget>(null)
//显示编辑页面
export function showEditPage(targetRule:CustomTimeRule|null){
    ifShowEditPage.value = true
    editTarget.value = targetRule
}
//隐藏编辑页面
export function hideEditPage(){
    ifShowEditPage.value = false
}

//给rule的unit排序
export function sortRuleUnits(units: CustomTimeRuleUnit[]): CustomTimeRuleUnit[] {
    // 先将 target 为 false 的 unit 筛选出来，最后处理
    const falseUnits = units.filter(unit => unit.target === false);
    const otherUnits = units.filter(unit => unit.target !== false);

    // 对其他单位按 equal 值从大到小进行排序
    const compare = (unitA: CustomTimeRuleUnit, unitB: CustomTimeRuleUnit): number => {
        if(unitA.target==false || unitB.target==false)return 0
        if(unitA.target == unitB.name){
            return -1
        }
        else if(unitB.target == unitA.name){
            return 1
        }
        else if(unitA.target == unitB.target){
            return (unitB.equal ?? 0) - (unitA.equal ?? 0);
        }
        else{
            return 0
        }
    };

    const sortedOtherUnits = otherUnits.sort(compare);
    // 返回组合后的排序数组：先是其他单位（按 equal 排序），最后是 target 为 false 的单位
    return [...sortedOtherUnits, ...falseUnits];
}

//通过key获取指定的自定义时间规则
export function getCustomTimeRuleByKey(key:string){
    //先在全局找
    let rule = customTimeLib.find((rule)=>rule.__key == key)
    if(rule)return rule
    else{
        console.error("未能找到指定的自定义时间规则，可能已经删除或不存在")
        return false
    }
}

//通过递归获得某个unit相较于其对应的target直到最小单位时的等价值
//eg:1时 = 3600秒
export function getCustomEqualToUnit(unitList:CustomTimeRuleUnit[],unit:CustomTimeRuleUnit,base:number){
    const target = unit.target;
    //当前单位就是最小单位
    if(target == false){return base}
    const targetUnit = unitList.find((unit)=>unit.name == target)
    //如果没有找到目标单位，即要么不存在目标单位,要么该单位不会指向最小单位，返回false
    if(!targetUnit){return false}
    //目标为最小单位，返回已有equal*base的值即为unit与最小单位的equal
    if(targetUnit.target == false){
        return base * unit.equal
    }
    //否则从UnitList中移除当前unit，进行递归
    const index = unitList.indexOf(unit)
    const newList = unitList.filter((_, i) => i !== index);
    return getCustomEqualToUnit(newList,targetUnit,base*unit.equal)
}
