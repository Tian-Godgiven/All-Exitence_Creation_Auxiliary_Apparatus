import { addDays, addHours, addMilliseconds, addMinutes, addMonths, addSeconds, addYears, differenceInDays, differenceInHours, differenceInMilliseconds, differenceInMinutes, differenceInMonths, differenceInSeconds, differenceInYears, getDate, getDay, getDaysInMonth, getHours, getMilliseconds, getMinutes, getMonth, getSeconds } from "date-fns"
import { TimeUnit } from "element-plus"
import { CustomTimeRule, CustomTimeRuleUnit, customTimeLib, TimeRule } from "./customTime"
import { showPopUp } from "@/hooks/pages/popUp"
import Selector from "./popUp/Selector.vue"
import { shallowRef } from "vue"
import { isString } from "lodash"


// 写在前面：由于涉及大量的类型翻译，加上时间规则上对date（地球历法）和自定义时间规则的区分
// 导致几乎所有翻译过程都有两套内容，为避免繁琐也为了统一流程，将date和自定义时间规则分别放置在同一处，将统一的调用函数集中放置在开头




/**
 * 时间对象数值
 * @param number 这个时间的总值
 * @param rule 这个时间使用的表达式名称
 */
export type TimeValue = {
    number:number,
    rule:string | "date"
}

/**
 * 时间对象数组
 */
export type TimeArr = {
    name:string,
    value:number
}[]

/**
 * 允许使用的时间连接符
 */
export type TimeLinker = 
    false|//不需要链接符
    "/"|//下划线
    "-"|//分隔线
    ":"

/**
 * 通过时间表达式翻译得到时间值的设置项
 * @param value 需要翻译的时间对象的值
 * @param rule 翻译所需的时间规则
 * @param unitFrom,unitEnd 翻译结果的首尾单位，余数均会舍去
 * @param linker 可选的时间连接符
 * @param showUnit 是否显示单位
 */
export type TimeTranslateItem = TranslateItem & {
    linker?:TimeLinker,
    showUnit?:boolean,
}

//date类型的翻译过程需要使用的类型
type DateUnit = "年"|"月"|"日"|"时"|"分"|"秒"|"毫秒"
type DateArrItem = {
    name:DateUnit,
    value:number
}

//翻译过程使用的通用类型
type TranslateItem = {
    value:number,
    rule:CustomTimeRule | "date",
    unitFrom?:string,
    unitEnd?:string
}

//根据key获取指定的时间表达式
export function getTimeRule(key:"date"|string):"date"|CustomTimeRule|false{
    if(key == "date")return key;
    //否则在全局or项目中寻找这个时间表达式
    const tmp = customTimeLib.find((timeRule)=>timeRule.__key == key)
    if(tmp){return tmp}
    //找不到指定的时间表达式返回false
    return false
}

//获取指定时间规则的从指定开始单位（大）到指定结束单位（小）的所有单位
export function getTimeRuleUnits(timeRule:TimeRule,unitFrom?:string,unitEnd?:string){
    let start = false
    const unitList:(DateUnit|CustomTimeRuleUnit)[] = []
    //date类型
    if(timeRule == "date"){
        const dateArr:DateUnit[] = ["年","月","日","时","分","秒","毫秒"]
        //遍历寻找指定的单位
        for(let i=0;i<dateArr.length;i++){
            //起始:找到from或没有from
            if(dateArr[i] == unitFrom || !unitFrom){
                start = true
            }
            if(start){
                unitList.push(dateArr[i])
            }
            //找到结束的单位
            if(dateArr[i] == unitEnd){
                return unitList
            }
        }
    }
    //自定义时间规则类型
    else{
        //要求若设定起始和结束，则其都必须存在于units中
        let allUnitList = timeRule.units
        const noFrom = unitFrom && !allUnitList.find((unit)=>unit.name==unitFrom)
        const noEnd = unitEnd && !allUnitList.find((unit)=>unit.name==unitEnd)
        if(noFrom){
            console.error(timeRule,unitFrom)
            throw new Error("时间规则中不存在指定的起始单位")
        }
        if(noEnd){
            console.error(timeRule,unitEnd)
            throw new Error("时间规则中不存在指定的结束单位")
        }
        //遍历规则中的单位
        let start = false
        for(let unit of allUnitList){
            if(unit.name == unitFrom || !unitFrom || noFrom){
                start = true
            }
            //添加到列表中
            if(start){
                unitList.push(unit)
            }
            //结束的单位
            if(unit.name == unitEnd){
                return unitList
            }
        }
    }
    //没有设置结束单位
    return unitList
}

/**
 * 
 * @param rule 时间规则
 * @param nowUnit 当前单位
 * @param howMuch 比其大或小n号的单位
 * @returns 
 */
//获取指定时间规则的，更大或更小的单位，当前单位默认为最小单位
export function getTimeRuleBiggerUnit(rule:TimeRule,nowUnit?:string,howMuch:number=1){
    const unitList = getTimeRuleUnits(rule)
    let biggerUnit
    if(!nowUnit){
        //返回倒数第n大的单位
        const index = unitList.length - howMuch
        biggerUnit = returnBiggerUnit(index)
    }
    else{
        //找到当前单位的位置
        const index = unitList.findIndex(unit=>{
            if(isString(unit)){
                return unit == nowUnit
            }
            else{
                return unit.name == nowUnit
            }
        })
        //返回比他大howMuch位的单位(前howMuch位)
        biggerUnit = returnBiggerUnit(index-howMuch)
    }
    if(!isString(biggerUnit)){
        biggerUnit = biggerUnit?.name
    }
    if(biggerUnit && biggerUnit!=nowUnit){
        return biggerUnit
    }
    //如果最终没有得到目标单位，或者得到的结果与当前单位一致则返回false
    return false

    //递归函数
    function returnBiggerUnit(index:number){
        //找到最小单位了
        if(index == unitList.length-1){
            return unitList.at(index)
        }
        const targetUnit = unitList.at(index)
        //没有找到则往后找
        if(!targetUnit){
            return returnBiggerUnit(index+1)
        }
        return targetUnit
    }
}
export function getTimeRuleSmallerUnit(rule:TimeRule,nowUnit?:string,howMuch:number=1){
    const unitList = getTimeRuleUnits(rule)
    let smallerUnit
    if(!nowUnit){
        //返回第二大的单位
        smallerUnit = returnSmallerUnit(1)
    }
    else{
        //找到当前单位的位置
        const index = unitList.findIndex(unit=>{
            if(isString(unit)){
                return unit == nowUnit
            }
            else{
                return unit.name == nowUnit
            }
        })
        //返回比他小howMuch位的单位(后howMuch位)
        smallerUnit = returnSmallerUnit(index+howMuch)
    }
    //获得字符串
    if(!isString(smallerUnit)){
        smallerUnit = smallerUnit?.name
    }
    //如果最终没有得到目标单位，或者得到的结果与当前单位一致
    if(smallerUnit && smallerUnit!=nowUnit){
        return smallerUnit
    }
    
    return false

    //递归函数
    function returnSmallerUnit(index:number){
        //找到最小单位了
        if(index == unitList.length-1){
            return unitList.at(index)
        }
        const targetUnit = unitList.at(index)
        //没有找到则往后找
        if(!targetUnit){
            return returnSmallerUnit(index+1)
        }
        return targetUnit
    }
}

//翻译时间表达式，返回一个字符串
export function translateTimeValueToString({
    value,
    rule,
    linker=false,
    showUnit=true,
    unitFrom,
    unitEnd
}:TimeTranslateItem){
    //如果用的是Date规则
    if(rule == "date"){
        const date = getDate_ValueToArr(value,unitFrom,unitEnd)
        const str = linkUnit(date,showUnit,linker)
        return str
    }
    //用的是自定义规则
    else{
        //备忘：自定义时间表达式的翻译没有做完
        //未完成
    }
}

/**
 * 根据时间规则翻译时间值，返回一个由单位名和各单位的值组成的数组
 * @returns 顺序从大单位到小单位
 */
export function translateTimeValueToArr({
    value,
    rule,
    unitFrom,
    unitEnd
}:TranslateItem):TimeArr{
    //如果是date直接调用函数
    if(rule == "date"){
        return getDate_ValueToArr(value,unitFrom,unitEnd)
    }
    return getCustom_ValueToArr(value,rule,unitFrom,unitEnd)
}
//将时间数组按规则翻译为数字
export function translateTimeArrToValue(timeArr:TimeArr,rule:TimeRule){
    //如果是date规则
    if(rule == "date"){
        return getDate_ArrToValue(timeArr as DateArrItem[])
    }
    return getCustom_ArrToValue(timeArr,rule)
}

/**
 * 获取时间值中存在的进位数组，进位的定义是某个单位在当次得到了由指定最小单位的进位
 * @param timeValue 时间值
 * @param rule 时间规则
 * @param unitFrom 默认为最大单位
 * @param unitEnd 默认为最小单位
 */
export function translateTimeValueToCarryover({value,rule,unitFrom,unitEnd}:{
    value:number,rule:TimeRule,unitFrom?:string,unitEnd?:string
}){
    //获取值对应的单位数组
    const timeArr = translateTimeValueToArr({
        value,
        rule,
        unitFrom,
        unitEnd
    })
    const result:{name:string,value:number}[] = []
    //从小到大访问单位，判断每个单位的值，若为1，则认为存在进位，否则不存在进位跳过
    for(let i=timeArr.length-1;i>0;i--){
        const unit = timeArr[i]
        if(unit.value == 1){
            result.unshift(timeArr[i-1])
        }
        else{
            break
        }
    }
    return result
}

//将一个完整的时间值转化为相较于指定单位的值，默认不包含小数点
export function translateTimeValueEqualToUnit(value:number,rule:TimeRule,unitName?:string,decimalMode?:boolean){
    if(rule=="date"){
        if(!unitName)unitName = "日"
        return getDate_ValueToUnit(value,unitName,decimalMode)
    }
    return getCustom_ValueToUnit(value,rule,unitName,decimalMode)
}
//将一个指定单位的值转化为一个完整的时间值
export function translateTimeUnitValueToValue(unitValue:number,unitName:string,rule:TimeRule){
    if(rule == "date"){
        return getDate_UnitToValue(unitValue,unitName)
    }
    //自定单位直接翻译成值
    else {
        return translateTimeArrToValue([{
            name:unitName,
            value:unitValue
        }],rule)
    }
}






//date类型
const dateUnits = ["年","月","日","时","分","秒"]
    //将date值转换为date单位数组
    function getDate_ValueToArr(time:number,unitFrom?:string,unitEnd?:string):DateArrItem[]{
        const date = new Date(time)
        const options:DateArrItem[] = [];
        //获取包含的单位
        const unitList = getTimeRuleUnits("date",unitFrom,unitEnd) as DateUnit[]
        //遍历单位，依次计算值
        unitList.forEach((unit)=>{
            pushToOptions(unit)
        })
        return options
        function pushToOptions(name:DateUnit){
            let value:number = 0
            switch(name){
                case "年":
                    value=date.getFullYear()
                    break;
                case "月":
                    value=date.getMonth() + 1//从0开始
                    break;
                case "日": 
                    value=date.getDate()
                    break;
                case "时":
                    value=date.getHours()
                    break;
                case "分":
                    value=date.getMinutes()
                    break;
                case "秒":
                    value=date.getSeconds()
                    break;
                case "毫秒":
                    value=date.getMilliseconds()
                    break;
            }
            options.push({name,value: value})
        }
    }

    //反过来让date单位数组变回date值
    function getDate_ArrToValue(dateArr: DateArrItem[]): number {
        let year = 1970, month = 1, day = 1, hours = 0, minutes = 0, seconds = 0, milliseconds = 0;
        for (const item of dateArr) {
            switch (item.name) {
                case "年":
                    year = item.value;
                    break;
                case "月":
                    month = item.value;
                    break;
                case "日":
                    day = item.value;
                    break;
                case "时":
                    hours = item.value;
                    break;
                case "分":
                    minutes = item.value;
                    break;
                case "秒":
                    seconds = item.value;
                    break;
                case "毫秒":
                    milliseconds = item.value;
                    break;
            }
        }

        // 由于JavaScript的月份从0开始，所以需要减去1
        const date = new Date(year, month-1, day, hours, minutes, seconds, milliseconds);
        return date.getTime();
    }

    //将date的值转化为某个单位的值,结果保留一位小数
    function getDate_ValueToUnit(value:number,unitName:string,decimalMode:boolean=false){
        //默认时间戳，注意月份从0开始
        const idleDate = new Date(1970,0,1)
        //当前时间戳
        const date = new Date(value)
        //获取指定单位的值
        let targetValue = getUnitValueByUnitName(unitName)
        if(!decimalMode)return targetValue
        //获取该单位小一号单位的值
        const targetIndex = dateUnits.indexOf(unitName)
        const smallName =  dateUnits[targetIndex+1]
        if(!smallName)return targetValue
        //获取小数部分
        const decimal = Number(getDecimal().toFixed(2))
        //返回相加后的值
        return decimal + targetValue

        function getUnitValueByUnitName(unitName:string){
            switch(unitName){
                case "年":
                    return differenceInYears(date,idleDate)
                case "月":
                    //这里是计算过程中由于月份从0开始所以少了一个月
                    return differenceInMonths(date,idleDate)+1
                case "日":
                    return differenceInDays(date,idleDate)
                case "时":
                    return differenceInHours(date,idleDate)
                case "分":
                    return differenceInMinutes(date,idleDate)
                case "秒":
                    return differenceInSeconds(date,idleDate)
                case "毫秒":
                    return differenceInMilliseconds(date,idleDate)
                default:
                    return differenceInYears(date,idleDate)
            }
        }
    
        //获取小数值
        function getDecimal(){
            switch(smallName){
                case "月":
                    return getMonth(date)/12;
                case "日":
                    return getDate(date)/getDaysInMonth(date);
                case "时":
                    return getHours(date)/24;
                case "分":
                    return getMinutes(date)/60;
                case "秒":
                    return getSeconds(date)/60;
                case "毫秒":
                    return getMilliseconds(date)/100;
                default:
                    return getDay(date)/1
            }
        }
    }

    //将date中某个单位的值转化为Date值
    function getDate_UnitToValue(unitValue:number,unitName:string){
        //当前时间为默认起始时间
        let nowDate = new Date(1970,0,1) 
        switch (unitName) {
            case "年":
                nowDate = addYears(nowDate,unitValue-1970)
                break;
            case "月":
                nowDate = addMonths(nowDate,unitValue-1)
                break;
            case "日":
                nowDate = addDays(nowDate,unitValue)
                break;
            case "时":
                nowDate = addHours(nowDate,unitValue)
                break;
            case "分":
                nowDate = addMinutes(nowDate,unitValue)
                break;
            case "秒":
                nowDate = addSeconds(nowDate,unitValue)
                break;
            case "毫秒":
                nowDate = addMilliseconds(nowDate,unitValue)
                break;
        }
        return nowDate.getTime();
    }

    //获取Date对象的时间差数组
    function getDateTimeOutArrByUnit(startTime:TimeValue,endTime:TimeValue,unitFrom:TimeUnit,unitEnd:TimeUnit){
        const options:any = [];
        const arr = ["year","month","day","hour","minute","second","millisecond"]
        let tmp = false
        const start = startTime.number
        const end = endTime.number
        for(let i=0;i<arr.length;i++){
            //起始:找到from或没有from
            if(arr[i] == unitFrom || !unitFrom || !arr.includes(unitFrom)){
                tmp = true
            }
            if(tmp){
                pushToOptions(i)
            }
            //结束的单位
            if(arr[i] == unitEnd || arr[i] == 'millisecond'){
                return options
            }
        }
        function pushToOptions(i:number){
            let unit:string = "年"
            let number:number = 0

            //根据单位，获得两个Date的差值
            switch(arr[i]){
                case "year":
                    unit="年",
                    number=differenceInYears(start,end)
                    break;
                case "month":
                    unit="月",
                    number=differenceInMonths(start,end)
                    break;
                case "day":
                    unit="日",
                    number=differenceInDays(start,end)
                    break;
                case "hour":
                    unit="时",
                    number=differenceInHours(start,end)
                    break;
                case "minute":
                    unit="分",
                    number=differenceInMinutes(start,end)
                    break;
                case "second":
                    unit="秒",
                    number=differenceInSeconds(start,end)
                    break;
                case "millisecond":
                    unit="毫秒",
                    number=differenceInMilliseconds(start,end)
                    break;
            }
            options.push({unit,number})
        }
    }

    //获取两个Date对象相差的天/时/分数组
    export function getDateDistanceDHM(startTime:number,targetTime:number){
        const day = differenceInDays(targetTime,startTime)
        const minute = differenceInMinutes(targetTime,startTime) % 60
        const hour = differenceInHours(targetTime,startTime) % 24
        return {
            day,hour,minute
        }
    }
//自定义时间类型
    //获取一个时间值在自定义时间表达式下的时间对象数组
    function getCustom_ValueToArr(value:number,rule:CustomTimeRule,unitFrom?:string,unitEnd?:string){
        const result:TimeArr = []//结果数组
        //剩余可分配值
        let leastValue = value
        //获取所有需要包含在内的单位
        const unitList = getTimeRuleUnits(rule,unitFrom,unitEnd) as CustomTimeRuleUnit[]
        //遍历每个单位并获取值
        unitList.forEach(unit=>{
            getUnitValue(unit)
        })
        return result
        
        function getUnitValue(unit:CustomTimeRuleUnit){
            let unitValue:number
            // 非最小单位
            if(unit.target !== false) {
                // 当前单位等于多少最小单位
                const unitEqual = unit.equalToMin
                // 当前单位无效，将其忽略
                if(!unitEqual)return;
                //计算当前单位的值
                unitValue = Math.floor(leastValue / unitEqual)
                // 用余数更新剩余值
                leastValue -= (unitValue * unitEqual);
            } 
            // 最小单位，直接将剩余值分配给它
            else{
                unitValue = leastValue
            }
            //所有时间单位的起始值为1，添加上1
            unitValue += 1
            result.push({ name: unit.name, value: unitValue });
        }
    }
    //将时间对象数组按自定义时间规则转化为时间值
    function getCustom_ArrToValue(timeArr:TimeArr,rule:CustomTimeRule){
        let totalValue = 0
        // 遍历数组
        for(let item of timeArr){
            // 从规则中找到这个单位
            const unit = rule.units.find((unit)=>unit.name == item.name)
            if(!unit){
                console.error("没有在规则中找到指定的单位",rule,item.name)
                return false
            }
            // 获取这个单位相较于最小单位的值,加在总值中
            if(unit.target){
                const equalToMin = unit.equalToMin
                if(!equalToMin){return false}
                totalValue += equalToMin * (item.value-1)
            }
            //最小单位加上
            else{
                totalValue += (item.value-1)
            }
        }
        return totalValue
    }
    //将完整的时间值转化为某个单位的值
    function getCustom_ValueToUnit(value:number,rule:CustomTimeRule,unitName?:string,decimalMode:boolean=false){
        //如果没有指定单位，默认使用最小单位
        let unit
        if(!unitName){
            unit = rule.units.find(unit=>unit.target === false)
        }
        else{
            //获取指定单位
            unit = rule.units.find(unit=>unit.name == unitName)
        }
        //获取值相较于指定单位的值
        if(unit?.target && unit?.equalToMin){
            //整数部分
            const targetValue = value/unit.equalToMin
            //获取小数部分
            if(decimalMode){
                //小一个单位
                const smallUnit = rule.units.find(i=>i.name == unit.target)
                //小一个单位的值
                if(!smallUnit)return targetValue
                let equalToMin = 1//最小单位即为1
                if(smallUnit.target && smallUnit.equalToMin){
                    equalToMin = smallUnit.equal
                }
                const smallValue = (value%unit.equalToMin)/equalToMin
                //小数部分
                const decimal = Number((smallValue/unit.equal).toFixed(2))
                return decimal + targetValue
            }
            return targetValue
        }
        else{
            return value
        }
    }




//获取两个时间对象的时间差字符串
export function translateTimeOut({
    startTime,endTime,rule,
    linker=false,
    showUnit=true,
    unitFrom=null,
    unitEnd=null
}:{
    startTime:TimeValue,
    endTime:TimeValue,
    rule:TimeRule,
    linker:TimeLinker,
    showUnit:boolean,
    unitFrom:string|null,
    unitEnd:string|null
}){
    //常规时间
    if(rule == "date"){
        //获取时间数组
        const timeOutArr = getDateTimeOutArrByUnit(startTime,endTime,unitFrom as any,unitEnd as any)
        //链接起来
        const str = linkUnit(timeOutArr,showUnit,linker)
        return str
    }
    //自定义时间
    else{
        //未完成
    }
}

    



//使用指定的linker链接时间对象
function linkUnit(timeArr:TimeArr,showUnit:boolean=true,linker:TimeLinker=false){
    let str = ""
    const maxIndex = timeArr.length-1
    timeArr.forEach((item,index) => {
        str += item.value
        //是否显示单位
        if(showUnit){
            str += item.name
        }
        //linker链接的字符串
        if(linker && index != maxIndex){
            str += linker
        }   
    });
    return str
}

//显示时间选择弹窗，其中包括date也就是现实时间
export function showTimeSelector():Promise<TimeRule|false>{
    return new Promise((resolve)=>{
        showPopUp({
            vue:shallowRef(Selector),
            mask:true,
            buttons:[],
            returnValue:(selectRule:TimeRule)=>{
                if(selectRule){
                    resolve(selectRule)
                }
            },
            onClose:()=>{
                resolve(false)
            }
        })
    })
    
}

// 数符转换表
const numFormatList = {
    "阿拉伯数字": (num: number) => num, // 阿拉伯数字直接转为字符串
    "简体中文数字": (num: number) => {
        const chineseNumbers = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
        return num.toString().split('').map(digit => chineseNumbers[parseInt(digit)]).join('');
    },
    "繁体中文数字": (num: number) => {
        const chineseNumbers = ['零', '壹', '貳', '叁', '肆', '伍', '陸', '柒', '捌', '玖'];
        return num.toString().split('').map(digit => chineseNumbers[parseInt(digit)]).join('');
    }
};
// 翻译为数字格式
export function translateTimeNumFormat(value: number, numFormat: "阿拉伯数字" | "简体中文数字" | "繁体中文数字") {
    if (numFormatList[numFormat]) {
        return numFormatList[numFormat](value);
    } else {
        console.error('不支持的数字形式');
        return value
    }
}