import gsap from "gsap";

//使得一个dom元素的上下or左右不超过容器的边缘
export function doNotOverContainer(
    dom:HTMLElement,container:HTMLElement,
    side:"vertical"|"horizon"|"all"="all",
    gap:number=10,
    animateTime:number=0.2,
){
    //调整位置以使得展开后的聚焦板正常显示
    const {clientWidth: cWidth, clientHeight: cHeight} = container//屏幕高宽
    const {offsetLeft, offsetTop,clientWidth:dWidth,clientHeight:dHeight} = dom
    //上下
    if(side!="vertical"){
        if (offsetTop < 0) {
            gsapAnimate("top",gap)
        } 
        else if (offsetTop + dHeight > cHeight) {
            gsapAnimate("top",(cHeight-dHeight)-gap)
        }  
    }
    //左右
    if(side != "horizon"){
        if (offsetLeft < 0){
            gsapAnimate("left",gap)
        }else if (offsetLeft + dWidth > cWidth) {
            gsapAnimate("left",(cWidth-dWidth)-gap)
        }  
    }
    //动画
    function gsapAnimate(direction:"left"|"top",num:number){
        console.log("正在进行动画",direction,num)
        gsap.to(dom,{
            [direction]:`${num}px`,
            duration:animateTime,
            ease:"power1.inOut"
        })
    }

    
}