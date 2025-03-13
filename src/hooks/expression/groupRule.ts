import { Exitence } from "@/class/Exitence";
import { groupRuleSimbolList } from "@/static/list/groupRuleList";
import { getExitenceStatusByKey  } from "../all-exitence/allExitence";
import { showQuickInfo } from "@/api/showQuickInfo";
import { isArray } from "lodash";

//规则最开始的连接符号
const linker = "&&|\|\||!"

//规则中间的计算符号
// 使用 reduce 来拼接字符串，并为每个元素添加转义符
let separator = (function(){
    const tmp = groupRuleSimbolList.reduce((arr, tmp) => {
        arr += tmp.value+'|';;
        return arr;
    }, "");
    return tmp.slice(0,-1) //去掉最后一个|符号
})()
 // 匹配前、中、后三部分
const regex = new RegExp(`^(${linker})(.*?)(${separator})(.*?)$`); 


//拆解分组规则，将字符串拆成可用数组
export function separateRule(ruleData:string):{linker:string,target:string,simbol:string,value:any,ifHave:boolean}|null{
    // 匹配have类型
    const regex2 = /^(.+)\.have\((.+)\)$/
    
    // 判断是否为have类型
    const matchHave = ruleData.match(regex2)
    let ifHave = false
    if(matchHave){
        ruleData = matchHave[1] + matchHave[2]
        ifHave = true
    }
    // 使用正则表达式匹配字符串
    const match = ruleData.match(regex);
    // 如果匹配成功，拆分成四部分并返回
    if (match) {
        const tmp = {
            linker: match[1],
            target: match[2],  // 前部分
            simbol: match[3],  // 分隔符
            value: match[4],  // 后部分
            ifHave
        };
        return tmp
    } 
    else {
        // 如果没有匹配到，返回空
        return null;
    }

}

//使用分组规则筛选事物
export function filterExitenceByRule(exitence:Exitence,rules:any[]){
    //遍历规则
    let result = true
    for(let ruleData of rules){
        const rule = separateRule(ruleData)
        const linker = rule?.linker
        const ruleResult = checkRule(exitence,rule)
        //根据连接符号修改结果
        if(linker == "&&"){
            result = result && ruleResult
        }
        else if(linker == "||"){
            result = result || ruleResult
        }
        else if(linker == "!"){
            result = result && !ruleResult
        }
        //过程中出现不满足规则的情况时直接返回false
        if(result == false){
            return false
        }
    }

    return result


    //判断事物是否符合规则
    function checkRule(exitence:Exitence,rule:any):boolean{
        //获取rule的目标
        const target = getRuleTargetFromExitence(exitence,rule.target)
        const simbol = rule.simbol
        const value = rule.value
        //如果是have类型的，则对target的每个子元素进行检验，当其中一个符合条件时，返回true
        if(rule.ifHave){
            if(isArray(target)){
                return target.some((tmpTarget)=>checkTarget(tmpTarget))
            }
            else{
                return false
            }
        }
        else{
            return checkTarget(target)
        }
        //检查目标是否符合条件 
        function checkTarget(target:any){
            //根据符号进行不同的比较
            switch(simbol){
                case "==":
                    return target==value;
                case "!=":
                    return target != value;
                case ">":
                    if(!isNaN(target) && !isNaN(value)){
                        return parseFloat(target) > parseFloat(value)
                    }
                    else{
                        return false
                    }
                case "<":
                    if(!isNaN(target) && !isNaN(value)){
                        return parseFloat(target) < parseFloat(value)
                    }
                    else{
                        return false
                    }
                case "s>":
                    return target.length > value.length
                case "s<":
                    return target.length < value.length
                default:
                    showQuickInfo(`错误：无法识别的分组规则符号${simbol}`)
                    return false
            }
        }
    }
    //获取规则目标在事物中的值
    function getRuleTargetFromExitence(exitence:Exitence,targetString:string){
        switch(targetString){
            case "name":
                return exitence.name
            case "statusNum":
                return exitence.status.length
            case "tag":
                const tagStatusKey = exitence.setting?.tagStatus
                const tagStatus = getExitenceStatusByKey(tagStatusKey,exitence.status)
                return tagStatus.value
            default:
                //事物的某个属性值：提取其中的属性key
                const regex1 = /^\[(.*)\]\.value$/; 
                const key = targetString.match(regex1)?.[1];
                if (key) {
                    //返回事物的所有属性
                    if(key=="allStatus"){
                        return exitence.status
                    }
                    //获取事物该属性的值
                    const status = getExitenceStatusByKey(key,exitence.status)
                    return status.value
                } 
                //事物的某个设置值
                else{
                    const regex2 = /^setting\[(.*)\]$/;  // 匹配 setting[name] 结构
                    const setName = targetString.match(regex2);
                    if(setName){
                        return exitence.setting.setName
                    }
                    else{
                        showQuickInfo("错误：未定义含义的分组规则对象")
                        return ""
                    }
                }
        }
    }
}