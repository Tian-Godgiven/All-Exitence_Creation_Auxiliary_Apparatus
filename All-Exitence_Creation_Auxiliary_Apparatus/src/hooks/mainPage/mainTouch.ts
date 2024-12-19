import managePx from "@/api/managePx"
import { hideInputSupport } from "../inputSupport"
import { changePage, hidePage, leftMaxWidth, leftPageMask, leftShowing, leftShowWidth, rightMaxWidth, rightShowing, rightShowWidth, showPage } from "../pageChange"

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
// 是否已经开始了滑动
let startMove = true
// 根据屏幕宽度控制滑动速度和阈值 
const rpxShow = managePx(200) // 滑动显示阈值
const rpxHide = managePx(300) // 滑动隐藏阈值
const rpxSpeed = managePx(2) // 滑动速度阈值

// 滑动事件本身
export const touchStart = (e:any)=>{
	if(!changePage.value){
		return false
	}
	startX = e.touches[0].clientX
	startY = e.touches[0].clientY
	moveStartX = startX
	touchStartTime = Date.now()
}
// 滑动行动中
export function touchMove(e:any){
	if(!changePage.value){
		return false
	}
	// 若为竖直滑动，则不会显示页面
	if(ifVertical){
		return false 
	}
	// 否则禁止上下滑动
	e.preventDefault()
	
	if(startMove){
		hideInputSupport()
		startMove = false
	}
	
	// 移动距离
	let movingX = moveStartX - e.touches[0].clientX
	moveStartX = e.touches[0].clientX
	moveStartY = e.touches[0].clientY
	distantX = startX - moveStartX
	
	const angle = getLineAngle(startX,startY,moveStartX,moveStartY)
	// 滑动角度在30~150,210~330为竖直方向滑动
	if(!ifHorizontal && ((angle > 20 && angle < 160) || (angle > 200 && angle < 340))){
		ifVertical = true
		return false
	}
	else{
		ifHorizontal = true
	}
	// [向左滑] aka [右滑]
	if(distantX > 0){
		// 如果此时左侧界面已显示，逐渐隐藏左侧页面
		if(leftShowing){
			leftShowWidth.value = Math.max(leftShowWidth.value - movingX, 0);
			leftPageMask()
		}
		// 如果此时左侧页面未显示，并且右侧界面未显示，则逐渐显示右侧页面
		else if(!rightShowing){
			rightShowWidth.value = Math.min(rightShowWidth.value + movingX, rightMaxWidth);
		}
	}
	// [向右滑] aka [左滑]
	else if(distantX < 0){
		// 如果此时左侧界面未显示，逐渐显示左侧页面
		if(!leftShowing){
			leftShowWidth.value = Math.min(leftShowWidth.value - movingX, leftMaxWidth)
			//逐渐显示遮罩层
			leftPageMask()
		}
	}
}
// 滑动结束时
export function touchEnd(){
	if(!changePage.value){
		return false
	}
	
	startMove = true
	let touchEndTime = Date.now()
	let moveDistant = distantX
	let moveTime = touchEndTime - touchStartTime
	
	// 数据初始化
	startX = 0
	distantX = 0
	ifVertical = false
	ifHorizontal = false
	let slideSpeed = Math.abs(moveDistant) / moveTime
	// [向左滑] aka [右滑]
	if(moveDistant > 0){
		//如果左侧界面显示，
		if(leftShowing){
			// 并且滑动距离达到阈值 或 滑动速度达到阈值，则令左侧界面隐藏
			if(Math.abs(moveDistant) > rpxHide || slideSpeed > rpxSpeed){
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
			if(moveDistant > rightMaxWidth/2 || slideSpeed > rpxSpeed){
				showPage("right")
			}
			//如果显示失败，令显示的部分自动隐藏
			else{
				hidePage("right")
			}
		}
	}
	// [向右滑] aka [左滑]
	else if(moveDistant < 0){
		// 如果左侧页面未显示 并且 (滑动幅度大于100rpx 或 滑动速度大于10px/ms)
		if(!leftShowing && (Math.abs(moveDistant) > rpxShow || slideSpeed > rpxSpeed)){
			//则令左侧页面显示
			showPage("left")
		}
		// 否则打开失败，令其隐藏
		else{
			hidePage("left")
		}
	}
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