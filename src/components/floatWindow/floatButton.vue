<template>
<div class="floatBtn"
    :class="[{moveBtn: allowMove}, `${btnType}Btn`]"
    @pointerdown="touchStart"
    @pointermove="touchMove"
    @pointerup="touchEnd">
    <slot></slot>
</div>
</template>

<script setup lang='ts'>
import { doNotOverContainer } from '@/api/doNotOverContainer';
import { ref } from 'vue'
    type edge = "left"|"right"
    const {
        ifLongTap=true,
        longTapTime=300,
        allowEdge=true,
        edgeDistance=30,
        click,
        onMove,
        onHide,
        onEdge
    } = defineProps<{
        ifLongTap?:boolean, //是否在长按后才触发允许拖动，若为否则可以随时开始拖动
        longTapTime?:number, //长按时间，单位毫秒
        allowEdge?:boolean, //允许吸附到左右边缘
        edgeDistance?:number, //距离边缘多近时进行吸附，单位px
        click?:()=>void, //在点击时触发的事件，会和长按事件分开执行
        onMove?:(state:"start"|"stop",dom:HTMLElement)=>void, //拖动开始和结束均会执行一次的函数，按照state参数的值判断
        onHide?:(edgeName:edge,dom:HTMLElement)=>boolean, //触发了Hide事件（元素移动得过于出界）时执行的函数，如果这个函数返回了false则不再执行吸附函数
        onEdge?:(edgeName:edge,dom:HTMLElement)=>void, //触发了吸附边缘事件时执行的函数，在靠近允许吸附的边缘时达到edgeDistance的值时执行}
    }>()

    let timeOutEvent:NodeJS.Timeout//定时器
    let longTap = false//长按状态
    let allowMove = false//允许移动状态
    let moving = false //是否进行了移动
    // 原始位置
    let oldMousePos = {x:0,y:0}
    // 元素原始位置
    let oldNodePos= {x:0,y:0}
    let btnType= ref('right')
    function touchStart(ev:PointerEvent) {
        const selectDom = ev.currentTarget as HTMLElement
        // 需要进行长按:设置定时器
        if(ifLongTap){
            // 定时器控制长按时间，超过指定时间开始进行拖拽
            timeOutEvent = setTimeout(() => {
                longTap = true
                allowMove = true;
                if(onMove)onMove("start",selectDom)
            }, longTapTime);
        }
        //不需要则直接允许拖拽
        else{
            if(onMove)onMove("start",selectDom)//触发onMove
            allowMove = true
        }
        
        const { pageX, pageY } = ev; // 手指位置
        const { offsetLeft, offsetTop } = selectDom; // 元素位置
        // 手指初始位置
        oldMousePos = {x: pageX,y: pageY};
        // 元素初始位置
        oldNodePos = {x: offsetLeft,y: offsetTop};
        selectDom.style.left = `${offsetLeft}px`;
        selectDom.style.top = `${offsetTop}px`;
        
    }
    function touchMove(ev:PointerEvent) {
        // 清空长按定时器
        if (timeOutEvent)clearTimeout(timeOutEvent);
        if (allowMove) {
            moving = true
            const selectDom = ev.currentTarget as HTMLElement
            // x轴偏移量
            const lefts = oldMousePos.x - oldNodePos.x;
            // y轴偏移量
            const tops = oldMousePos.y - oldNodePos.y;
            const { pageX, pageY } = ev; // 手指位置
            selectDom.style.left = `${pageX - lefts}px`;
            selectDom.style.top = `${pageY - tops}px`;
        }
    }
    function touchEnd(ev:PointerEvent) {
        const selectDom = ev.currentTarget as HTMLElement
        // 清空定时器
        if(timeOutEvent)clearTimeout(timeOutEvent);
        //非长按，并且没有拖拽时触发点击事件
        if(!longTap && !moving && click){
            click()
        }
        //移动结算
        if(allowMove) {
            allowMove = false;
            const {clientWidth} = document.body;//屏幕高宽
            const {offsetLeft} = selectDom;//对象位置
            const {width} = selectDom.getBoundingClientRect()//对象宽高
            //获取离得最近的边缘
            const {theEdge,closeDis} = getCloseEdge()
            if(theEdge){
                //如果中心超出边缘，也就是说按键有一半都在屏幕外
                //即closeDis(靠近边缘的距离，在屏幕外时为负数)小于宽度一半的负数
                //则先响应hide事件，如果Hide事件返回false，则不继续
                if(onHide && closeDis < (-width /2)){
                    const tmp = onHide(theEdge,selectDom)
                    if(tmp == false){return;}
                }
                //允许吸附：吸附到该边缘+响应事件
                if(allowEdge){
                    selectDom.style.left = 
                        theEdge=="right" ? 
                        `calc(100% - ${width}px)` : "0px";
                    if(onEdge)onEdge(theEdge,selectDom)
                }
            }

            //不会超出上下边缘，如果不允许吸附=不允许超出左右边缘
            const side = allowEdge ? "horizon":"all"
            doNotOverContainer(selectDom,document.body,side,10) 

            function getCloseEdge(){
                //和左右的距离是否小于指定距离
                let closeDis = Infinity
                let theEdge:edge|null = null
                //靠近左边
                if(offsetLeft < edgeDistance){
                    closeDis = offsetLeft
                    theEdge = "left"
                }
                //优先靠近右边
                if(offsetLeft+width+edgeDistance > clientWidth){
                    const tmp = clientWidth - offsetLeft+width
                    if(closeDis >= tmp){
                        theEdge = "right"
                        closeDis=tmp
                    }
                }
                return {theEdge,closeDis}
            }
            //触发onMove的停止事件
            if(onMove)onMove("stop",selectDom)
        }
        //状态还原
        longTap = false
        moving = false
    }
    


</script>

<style lang="scss" scoped>
  @mixin notSelect{
    -moz-user-select:none; /*火狐*/
    -webkit-user-select:none; /*webkit浏览器*/
    -ms-user-select:none; /*IE10*/
    -khtml-user-select:none; /*早期浏览器*/
    user-select:none;
  }
  @mixin not-touch {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .floatBtn {
    @include notSelect;
    @include not-touch();
    position: fixed;
    z-index: 1;
    overflow: hidden;
    left: 0;
    top: 0;
    background-color: black;
  }
</style>
