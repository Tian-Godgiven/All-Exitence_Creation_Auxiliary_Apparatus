import managePx from "@/api/managePx"
import { hideInputSupport } from "@/hooks/inputSupport/inputSupport"
import { changePage, hidePage, leftMaxWidth, leftShowing, leftShowWidth, rightMaxWidth, rightShowing, rightShowWidth, showPage, changePageMaskWithPage } from "@/hooks/pages/pageChange"

// 滑动相关数据
let touchStartTime = 0
let startX:number
let startY:number
let moveStartX:number
let moveStartY:number
let distantX:number
// 判断是否为竖向/横向滑动
let ifVertical = false
let ifHorizontal = false
// 当前正在执行哪个方向的滑动
let movingDirection:"right"|"left"|null = null
// 是否已经开始了滑动
let startMove = false
// 根据屏幕宽度控制滑动速度和阈值 
const rpxShow = managePx(200) // 滑动显示阈值
const rpxHide = managePx(200) // 滑动隐藏阈值
const rpxSpeed = managePx(2) // 滑动速度阈值

// 滑动开始
export const touchStart = (e:PointerEvent)=>{
	if(!changePage.value){
		return false
	}
	startMove = true
	startX = e.clientX
	startY = e.clientY
	moveStartX = startX
	touchStartTime = Date.now()
}
// 滑动行动中
export function touchMove(e:PointerEvent){
	if(!changePage.value)return false
	if(!startMove)return false
	// 若为竖直滑动，则不会显示页面
	if(ifVertical)return false
	
	// 否则禁止上下滑动
	e.preventDefault()

	//开始滑动时，隐藏输入辅助栏
	hideInputSupport()
	
	// 移动距离
	let movingX = Math.abs(moveStartX - e.clientX)
	let direction:"right"|"left" = (moveStartX - e.clientX)>0?"right":"left"

	moveStartX = e.clientX
	moveStartY = e.clientY
	distantX = startX - moveStartX

	//计算滑动角度
	const angle = getLineAngle(startX,startY,moveStartX,moveStartY)
	// 滑动角度在30~150,210~330为竖直方向滑动
	if(!ifHorizontal && ((angle > 20 && angle < 160) || (angle > 200 && angle < 340))){
		ifVertical = true
		return false
	}
	else{
		ifHorizontal = true
	}
	// 显示右侧页面/隐藏左侧页面
	if(direction == "right"){
		// 如果当前在移动左侧页面，或者左侧页面显示，则隐藏左侧页面
		if(movingDirection == "left" || leftShowing){
			leftShowWidth.value = Math.max(leftShowWidth.value - movingX, 0);
			changePageMaskWithPage("left")
		}
		// 如果此时左侧页面未显示，并且右侧界面未显示，则逐渐显示右侧页面
		else if(!rightShowing){
			rightShowWidth.value = Math.min(rightShowWidth.value + movingX, rightMaxWidth);
			changePageMaskWithPage("right")
			//正在逐渐显示右侧页面
			movingDirection = "right"
		}
	}
	// [向右滑] aka [左滑]
	else if(direction=="left"){
		//如果右侧页面已显示，隐藏右侧页面
		if(rightShowing || movingDirection == "right"){
			rightShowWidth.value = Math.min(rightShowWidth.value - movingX, rightMaxWidth);
			changePageMaskWithPage("right")
		}
		// 如果此时左侧界面未显示，逐渐显示左侧页面
		else if(!leftShowing){
			leftShowWidth.value = Math.min(leftShowWidth.value + movingX, leftMaxWidth)
			//逐渐显示遮罩层
			changePageMaskWithPage("left")
			movingDirection = "left"
		}
	}
}
// 滑动结束时
export function touchEnd(){
	if(!changePage.value)return false
	let touchEndTime = Date.now()
	let direction = distantX>0?"right":"left" //判读方向
	const x = Math.abs(distantX)
	let moveTime = touchEndTime - touchStartTime
	
	// 数据初始化
	startX = 0
	distantX = 0
	ifVertical = false
	ifHorizontal = false
	movingDirection = null
	let slideSpeed = x / moveTime
	// [向左滑] aka [右滑]
	if(direction=="right"){
		//如果左侧界面显示
		if(leftShowing){
			// 并且滑动距离达到阈值 或 滑动速度达到阈值，则令左侧界面隐藏
			if(x > rpxHide || slideSpeed > rpxSpeed){
				hidePage("left")
			}
			//否则隐藏失败，令隐藏的部分自动显示
			else{
				showPage("left")
			}
		}
		//如果左侧页面未显示，并且右侧页面未显示
		else if(!rightShowing){
			//滑动范围达到阈值或滑动速度达到阈值，则令右侧显示
			if(x > rpxShow || slideSpeed > rpxSpeed){
				showPage("right")
			}
			//如果显示失败，令显示的部分自动隐藏
			else{
				hidePage("right")
			}
		}
	}
	// [向右滑] aka [左滑]
	else if(direction=="left"){
		//如果右侧界面显示,令其隐藏
		if(rightShowing){
			// 并且滑动距离达到阈值 或 滑动速度达到阈值，则令右侧界面隐藏
			if(x > rpxHide || slideSpeed > rpxSpeed){
				hidePage("right")
			}
			//否则隐藏失败，令隐藏的部分自动显示
			else{
				showPage("right")
			}
		}
		//如果右侧页面未显示，并且左侧页面未显示
		else if(!leftShowing){
			//滑动范围达到阈值或滑动速度达到阈值，则令左侧显示
			//注意这里滑动范围阈值较低
			if(x > rpxShow || slideSpeed > rpxSpeed){
				showPage("left")
			}
			//如果显示失败，令显示的部分自动隐藏
			else{
				hidePage("left")
			}
		}
	}
	startMove = false
}

// 获取角度判断滑动方向
function getLineAngle(x1:number, y1:number, x2:number, y2:number) {
    var x = x1 - x2,
    y = y1 - y2;
    if (!x && !y) {
        return 0;
    }
    var angle = (180 + Math.atan2(-y, -x) * 180 / Math.PI + 360) % 360;
    return 360 - angle;
}