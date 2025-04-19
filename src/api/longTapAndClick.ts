import { Ref } from "vue"

//默认的长按时长(ms)
const defaultLongTapTime = 500
//传给函数一个布尔值的ref用于记录是否是长按
export function LongTapAndClickTouchStart(ifLongTap:Ref,time:number=defaultLongTapTime){
    const theTimeOut = setTimeout(()=>{
        ifLongTap.value = true
    },time)
    return theTimeOut
}
//再传这个ref给它，判断执行长按或点击事件
export function LongTapAndClickTouchEnd({theTimeOut,ifLongTap,longTap,click}:{
    theTimeOut:any,
    ifLongTap:Ref,
    longTap:()=>void,
    click:()=>void
}){
    //清除计时器
    clearTimeout(theTimeOut)
    //是长按
    if(ifLongTap.value){
        longTap()
    }
    //是点击
    else{
        click()
    }
    ifLongTap.value = false
    
}