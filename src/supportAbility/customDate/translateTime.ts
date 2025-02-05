import { differenceInDays, differenceInHours, differenceInMilliseconds, differenceInMinutes, differenceInMonths, differenceInSeconds, differenceInYears } from "date-fns"
import { TimeUnit } from "element-plus"
import { TimeRule } from "./customTime"



/**
 * 时间对象
 * @param number 这个时间的总值
 * @param rule 这个时间使用的表达式名称
 */
export type TimeValue = {
    number:number,
    rule:string | "date"
}
/**
 * 允许使用的时间连接符
 */
export type TimeLinker = 
    null|//不需要链接符
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
export type CustomTimeTranslateItem = {
    value:TimeValue,
    rule:TimeRule,
    linker?:TimeLinker,
    showUnit?:boolean,
    unitFrom?:string|null,
    unitEnd?:string|null
}
//翻译时间表达式，返回一个字符串或对象
export function translateCustomTime({
    value,
    rule,
    linker=null,
    showUnit=true,
    unitFrom=null,
    unitEnd=null
}:CustomTimeTranslateItem){
    //如果用的是Date规则
    if(rule == "date"){
        const date = getDateArrByUnit(value.number,unitFrom as any,unitEnd as any)
        const str = linkUnit(date,showUnit,linker)
        return str
    }
    //用的是自定义规则
    else{
        //备忘：自定义时间表达式的翻译没有做完
        console.log("这里还没有做哦")
    }
}

//使用指定的linker链接时间对象
function linkUnit(timeArr:{unit:string,number:number}[],showUnit:boolean=true,linker:TimeLinker=null){
    let str = ""
    const maxIndex = timeArr.length-1
    timeArr.forEach((item,index) => {
        str += item.number
        //是否显示单位
        if(showUnit){
            str += item.unit
        }
        //linker链接的字符串
        if(linker && index != maxIndex){
            str += linker
        }   
    });
    return str
}

//按照指定的值获取Date对象数组
type DateUnit = "year"|"month"|"day"|"hour"|"minute"|"second"|"millisecond"
function getDateArrByUnit(time:number,unitFrom?:DateUnit,unitEnd?:DateUnit){
    const date = new Date(time)
    const options:any = [];
    const arr = ["year","month","day","hour","minute","second","millisecond"]
    let start = false
    for(let i=0;i<arr.length;i++){
        //起始:找到from或没有from
        if(arr[i] == unitFrom || !unitFrom || !arr.includes(unitFrom)){
            start = true
        }
        if(start){
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
        switch(arr[i]){
            case "year":
                unit="年",
                number=date.getFullYear()
                break;
            case "month":
                unit="月",
                number=date.getMonth() + 1//从0开始
                break;
            case "day":
                unit="日",
                number=date.getDate()
                break;
            case "hour":
                unit="时",
                number=date.getHours()
                break;
            case "minute":
                unit="分",
                number=date.getMinutes()
                break;
            case "second":
                unit="秒",
                number=date.getSeconds()
                break;
            case "millisecond":
                unit="毫秒",
                number=date.getMilliseconds()
                break;
        }
        options.push({unit,number})
    }
}

//获取两个时间对象的时间差
export function translateTimeOut({
    startTime,endTime,rule,
    linker=null,
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
        
    }
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
