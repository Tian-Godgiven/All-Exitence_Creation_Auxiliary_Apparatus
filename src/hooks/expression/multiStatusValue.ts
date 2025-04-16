import { getTypeStatusByKey } from "../all-exitence/allExitence";

// 该表达式为multi类型的属性的属性值中computed类型属性中使用到的特殊表达式
export interface multiStatusPart{
    value:any,
    valueType:string,
    __key:string
}
// 解释表达式，将表达式的值按规则拆分
export function explainExpression(expressionValue:any[]){
    const regex = /(\d+|[\^]{2}|[+\-*/%^()^\[\]]|\S+)/g;
    
    // 遍历数组，处理每个元素
    return expressionValue.flatMap(item => {
        // 如果是对象，将其作为一个单独的值处理
        try{
            const tmp = JSON.parse(item)
            if(tmp.type){
                return tmp
            }
            else{
                return item.match(regex) || []; // 拆分字符串
            }
        }
        catch{
            // 如果是字符串，使用正则拆分
            if (typeof item === 'string') {
                const tmp =  item.match(regex) || []; // 拆分字符串
                return tmp
            }
            // 对于其他类型的值，直接返回
            return item;
        }
    });

}

// 遍历表达式数组，并计算其中的值
export function countExpression(allStatus:any,allTypeStatus:any[],parts:any,expression:any[]){
    let totalValue
    let tmpArray:any[] = []
    let lastItem:any
    // 遍历数组，处理优先对象，将处理结果存放
    for(let i = 0;i<expression.length;i++){
        let item = expression[i];
        let index = i;
        let arr = expression
        //初始化
        if(lastItem == null){
            lastItem = item
        }
        //如果item的下一个对象是[]，记录item与[]中的内容，并进行计算
        if(expression[i+1] == "["){
            let stack = [] //记录括号数量
            let startIndex = index+1; // 括号开始位置
            let endIndex = null; // 闭括号位置
            // 遍历之后的项，寻找与这个括号匹配的闭括号
            for (let j = index + 2; j < arr.length; j++) {
                if (["(", "["].includes(arr[j])) {
                    stack.push(arr[j]); // 压入栈
                } else if ([")", "]"].includes(arr[j])) {
                    stack.pop(); // 弹出栈
                    if (stack.length === 0) {
                        endIndex = j; // 找到闭括号位置
                        break;
                    }
                }
            }
            if (endIndex !== null) {
                //遍历后移到后括号的位置
                i = endIndex
                //提取括号中的内容
                let inside = arr.slice(startIndex+1, endIndex);
                //计算括号内容的值
                let insideValue = countExpression(allStatus,allTypeStatus,parts,inside);
                let subExpression = [lastItem,"[",insideValue,"]"]
                //再计算取数组表达式的值
                let result = returnExpressionValue(subExpression)
                // 将这个计算结果添加到 tmpArray
                tmpArray.push(result); 
            }
        }
        //如果item是(，记录()中的内容，并进行计算
        else if(item == "("){
            let stack = [] //记录括号数量
            let startIndex = index; // 括号开始位置
            let endIndex = null; // 闭括号位置
            // 遍历之后的项，寻找与这个括号匹配的闭括号
            for (let i = index + 1; i < arr.length; i++) {
                if (["(", "["].includes(arr[i])) {
                    stack.push(arr[i]); // 压入栈
                } else if ([")", "]"].includes(arr[i])) {
                    stack.pop(); // 弹出栈
                    if (stack.length === 0) {
                        endIndex = i; // 找到闭括号位置
                        break;
                    }
                }
            }
            if (endIndex !== null) {
                //遍历后移后括号末尾
                i = endIndex + 1
                //提取括号中的内容为子表达式
                let subExpression = arr.slice(startIndex+1, endIndex);
                // 递归计算子表达式的值
                let result = countExpression(allStatus,allTypeStatus,parts,subExpression);
                // 将计算结果添加到 tmpArray占位
                tmpArray.push(result); 
            }
        }
        //非优先处理对象存放进去
        else{
            tmpArray.push(item)
        }
    }

    //再处理剩下的内容
    totalValue = returnExpressionValue(tmpArray)
    //返回最终的值
    if(Number.isNaN(totalValue)){
        totalValue = "数值运算有误"
    }
    return totalValue

    // 遍历一个表达式数组，返回该数组的值
    function returnExpressionValue(expression:any[]){
        let simbol:string
        let value:any
        expression.flatMap((item:any) => {
            //初始化
            let itemValue = getExpressionItemValue(allStatus,allTypeStatus,parts,item)
            if(value == null){
                value = itemValue
            }
            //记录符号
            else if(["+","-","*","/","%","^","^^","[","]"].includes(item)){
                simbol = item
            }
            else if(itemValue != undefined){
                //依次计算
                value = countExpressionPart(value,simbol,itemValue)
            }
            //传入的值为空或不存在
            else{
                value = value
            }
        })
        return value
    }
    
    
    
}
// 计算表达式中的每个部分
export function countExpressionPart(lastValue:any,simbol:string,nextValue:any){
    //取数组符号
    if(simbol == "["){
        //如果item是数字，则取value中第n个项或第n个符号
        if(!isNaN(nextValue)){
            //在该表达式中，数组长度从1开始，因此实际输入的值要大1=>输入1，找的是0号
            nextValue -= 1
            //数组长度为0时，返回0
            if(Array.isArray(lastValue) && lastValue.length == 0){
                return "[数组为空]"
            }
            //不是数组则视作字符串
            if(!Array.isArray(lastValue)){
                lastValue = lastValue.toString()
            }
            //超出上限时，返回最后一个元素
            if(nextValue > lastValue.length){
                return lastValue[-1]
            }
            //超出下限时，返回第一个元素
            else if(nextValue < -lastValue.length){
                return lastValue[0]
            }
            else{
                return lastValue[nextValue]
            }
        }
        //如果item不是数字，则value必须是一个对象，查询返回item键
        if(isNaN(nextValue)){
            //待完成
        }
    }
    else if(simbol == "+"){
        //双方都是数字
        if(!isNaN(lastValue) && !isNaN(nextValue)){
            lastValue = parseInt(lastValue) + parseInt(nextValue)
        }
        else{
            lastValue += nextValue
        }
    }
    else if(simbol == "-"){
        //前后任意是字符串的情况
        if(isNaN(nextValue) || isNaN(lastValue)){
            //从value中删去item中出现的字符串
            lastValue = lastValue.toString()
            lastValue = lastValue.replaceAll(nextValue,"")
        }
        //否则进行数字相减
        else{
            lastValue -= nextValue
        }
    }
    else if(simbol == "%"){
        //前后任意一方是字符串的情况
        if(isNaN(nextValue) || isNaN(lastValue)){
            //从value中删去item中出现的任意字符
            lastValue = lastValue.toString()
            for(let i of nextValue.toString()){
                lastValue = lastValue.replaceAll(i,"")
            }
        }
        //否则进行数字取余
        else{
            lastValue = lastValue % nextValue
        }
    }
    //不支持字符串计算的符号
    //如果任意一方是字符串，不会进行计算
    else if(!isNaN(nextValue) && !isNaN(lastValue)){
        if(simbol == "*"){
            lastValue = lastValue * nextValue
        }
        else if(simbol == "/"){
            lastValue = parseFloat((lastValue / nextValue).toFixed(5))
        }
        else if(simbol == "^"){
            lastValue = parseFloat(Math.pow(lastValue,nextValue).toFixed(5))
        }
        else if(simbol == "^^"){
            lastValue = parseFloat(Math.pow(lastValue,1/nextValue).toFixed(5))
        }
    }

    return lastValue
}

//获取表达式对象的值
function getExpressionItemValue(allStatus:any,allTypeStatus:any,parts:any,item:any){
    if(typeof item == "object"){
        //如果是引用属性
        if(item.type == "quoteStatus"){
            //获取目标属性
            const targetStatus = getQuoteStatus(allStatus,item.key)
            if(targetStatus){
                return targetStatus.value
            }
            else{
                return false
            }
        }
        //如果是引用部分
        else if(item.type == "quotePart"){
            //递归获取目标部分
            const targetPart = getQuotePart(parts,item.key)
            //如果目标部分是引用属性,则获得其目标属性
            if(targetPart.valueType == "quoteStatus"){
                const targetStatus = getQuoteStatus(allStatus,targetPart.value)
                //返回属性值
                if(targetStatus){
                    return targetStatus.value
                }
                else{
                    return false
                }
            }
            //如果目标部分是表达式，则获得其值
            else if(targetPart.valueType == "expression"){
                const expressionValue = countExpression(allStatus,allTypeStatus,parts,targetPart.value)
                return expressionValue
            }
            //如果目标是属性值，则获得其值为一个属性对象，再获得属性的值
            else if(targetPart.valueType == "statusValue"){
                return targetPart.value.value
            }
            return targetPart.value
        }
    }
    //是字符串
    else if(isNaN(item)){
        return item
    }
    //是数字
    else{
        return parseInt(item)
    }
}

//获取表达式的文本内容
export function getExpressionText(allStatus:any,allTypeStatus:any,expression:any[]){
    const infoText = expression.reduce((arr:string,value:any)=>{
        if(value.type && value.type=="quotePart"){
            arr+=("引用部分:"+value.key)
        }
        else if(value.type && value.type == "quoteStatus"){
            const targetStatus = getQuoteStatus(allStatus,value.key)
            const targetTypeStatus = getTypeStatusByKey(targetStatus.__key,allTypeStatus)
            arr += ("引用属性:"+(targetStatus.name??targetTypeStatus?.name))
        }
        else{
            arr+=value;
        }
        return arr
    },"")
    return infoText
}

//获取引用的属性目标
export function getQuoteStatus(allStatus:any[],statusKey:string){
    let tmp = allStatus.find((status:any)=>
        status.__key == statusKey
    )
    
    if(tmp){
        return tmp
    }
    else{
        return null
    }
}
//递归获取引用part的值
export function getQuotePart(parts:any,partKey:string){
    //寻找目标
    const targetPart = parts.value.find((tmpPart:multiStatusPart)=>
        tmpPart.__key == partKey
    )
    //递归寻找非引用part
    if(targetPart.valueType == "quotePart"){
        return getQuotePart(parts,targetPart)
    }
    else{
        return targetPart
    }
}