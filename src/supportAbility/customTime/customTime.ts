import { SupportAbilitySignUpItem } from "@/static/list/supportAbilityList"
import { showPopUp } from "@/hooks/pages/popUp"
import { reactive, ref, shallowRef, toRaw } from "vue"
import Manager from "./popUp/Manager.vue"
import { addToRightPage } from "@/hooks/pages/rightPage"
import { createDirByPath, ifExists, tryReadFileAtPath, writeFileAtPath } from "@/hooks/fileSysytem"
import { showQuickInfo } from "@/api/showQuickInfo"
import { showAlert } from "@/hooks/alert"
import { nowProjectInfo } from "@/hooks/project/projectData"
import { getEqualToMinUnit } from "./translateTime"

//注册自定义时间表达式
export const customTimeItem:SupportAbilitySignUpItem = {
    "name":"customTime",
    "init":()=>initCustomTime(),
    "call":()=>showCustomTimeManager(),
    "syncProject":(projectPath)=>changeProjectCustomTime(projectPath),
    "save":()=>saveCustomTime()
}

//自定义时间表达式类
export type TimeRule = "date"|CustomTimeRule//地球时间
export type CustomTimeRuleUnit = {
    name:string
    target:string,
    equal:number
}|{
    name:string
    target:false //最小单位
}
export type CustomTimeRule ={
    name:string,
    numFormat:"阿拉伯数字"|"简体中文数字"|"繁体中文数字",
    units:CustomTimeRuleUnit[],
    __key:string
}

//全局时间表达式库
export const globalCustomTime = reactive<CustomTimeRule[]>([])
//项目时间表达式库
export const projectCustomTime = reactive<CustomTimeRule[]>([])

//初始化
async function initCustomTime(){
    //尝试创建对应文件夹
    const ifExisit = await ifExists("supportAbility","customTime")
    if(!ifExisit){createDirByPath("supportAbility","customTime")}
    //尝试读取全局时间表达式
    const tmp = await tryReadFileAtPath("supportAbility/customTime","customTime.json",true,[])
    globalCustomTime.length = 0
    Object.assign(globalCustomTime,tmp)
    //注册右侧按钮
    addToRightPage({
        "name":"自定义时间",
        "click":()=>showCustomTimeManager(),
        "iconName":"customTime"
    })
}

//切换项目加载对应项目的时间表达式
async function changeProjectCustomTime(projectPath:string){
    //读取时间表达式
    const dataPath = projectPath + "/data"
    const tmp = await tryReadFileAtPath(dataPath,"customTime.json",true,[])
    projectCustomTime.length = 0
    Object.assign(projectCustomTime,tmp)
}

//保存
async function saveCustomTime(){
    //保存全局时间表达式
    await writeFileAtPath("supportAbility/customTime","customTime.json",toRaw(globalCustomTime))
    //保存项目时间表达式
    const dataPath = "projects/" + nowProjectInfo.pathName + "/data"
    console.log(dataPath)
    await writeFileAtPath(dataPath,"customTime.json",toRaw(projectCustomTime))
}


//将自定义时间表达式添加到指定位置
export function addCustomTimeRule(newRule:CustomTimeRule,position:"global"|"project"="global"){
    console.log(newRule)
    if(position == "global"){
        globalCustomTime.push(newRule)
    }
    else if(position == "project"){
        projectCustomTime.push(newRule)
    }
    return newRule
}

//删除指定的自定义时间表达式
export function deleteCustomTimeRule(rule:CustomTimeRule,position:"global"|"project"){
    showAlert({
        "info":`删除时间表达式${rule.name}?`,
        confirm:()=>{
            const range = position == "global"?globalCustomTime:projectCustomTime
            const index = range.indexOf(rule)
            if(index>=0){
                range.splice(index,1)
            }
        }
    })
    
}

//检查指定的时间表达式是否符合规范
export function checkCustomTimeRule(rule:CustomTimeRule,position:"global"|"project"){
    //名称在范围内不重复
    const name = rule.name
    const range = position=="global"?globalCustomTime:projectCustomTime
    const ifRepeat = range.find((theRule)=>theRule.name == name)
    if(ifRepeat && ifRepeat.__key != rule.__key){
        showQuickInfo(`时间表达式的名称在${position=="global"?"全局":"项目"}范围内不得重复`)
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
        //要求所有单位最终都可以转换为最小单位
        const ifEqualToMin = getEqualToMinUnit(unitList,unit,1)
        if(!ifEqualToMin){
            showQuickInfo(`${unit.name}无法转换为最小单位，可能存在递归调用。`)
            return false
        }
        
    }
    return true
        
}
//改变指定时间表达式的位置
export function changeCustomTimeRulePosition(rule:CustomTimeRule,newPosition:"global"|"project"){
    const oldRange = newPosition == "global"?projectCustomTime:globalCustomTime
    //从旧位置删去
    console.log(oldRange,rule)
    const index = oldRange.indexOf(rule)
    console.log(index)
    oldRange.splice(index,1)
    //添加进新位置
    addCustomTimeRule(rule,newPosition)
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
type EditTarget = {
    targetRule:CustomTimeRule|null,
    position:"global"|"project"
}
export const editTarget = reactive<EditTarget>({
    targetRule:null,
    position:"project"
})
//显示编辑页面
export function showEditPage({targetRule,position}:EditTarget){
    ifShowEditPage.value = true
    //修改编辑对象
    editTarget.targetRule = targetRule;
    editTarget.position = position
 }
//隐藏编辑页面
export function hideEditPage(){
    ifShowEditPage.value = false
    console.log(1234)
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
    console.log(sortedOtherUnits,falseUnits)
    return [...sortedOtherUnits, ...falseUnits];
}

//通过key获取指定的自定义时间规则
export function getCustomTimeRuleByKey(key:string){
    //先在全局找
    let rule = globalCustomTime.find((rule)=>rule.__key == key)
    if(rule)return rule
    //再在项目内找
    rule = projectCustomTime.find((rule)=>rule.__key == key)
    if(rule)return rule
    else{
        console.error("未能找到指定的自定义时间规则，可能已经删除或不存在")
        return false
    }
}