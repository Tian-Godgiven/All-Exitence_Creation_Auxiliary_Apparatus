import { ref } from 'vue';
import { rpxToPx } from "../api/rpxToPx"
import { changeMaskAlpha, hideMask, ifMask, maskAlphaMax, showMask } from './leftPageMask';

// 控制左侧页面显示
export let leftShowWidth = ref(0) //左侧显示的宽度，页面本身的宽度固定
export const leftMaxWidth = rpxToPx(650) //左侧页面最大宽度
let leftShowing = false

// 控制右侧页面显示
export let rightShowWidth = ref(0)
export const rightMaxWidth = rpxToPx(150)
export let rightShowing = false

// 切换右侧页面显示
export function switchRight(){
	if(rightShowing){
		hidePage("right")
	}
	else{
		showPage("right")
	}
}
// 显示左侧页面
export function showLeft(){
	showPage("left")
	leftPageMask()
}

const rpxShow = rpxToPx(200) // 滑动显示阈值
const rpxHide = rpxToPx(300) // 滑动隐藏阈值
const rpxSpeed = rpxToPx(2) // 滑动速度阈值

// 监听滑动事件
let touchStartTime = 0
let startX:number
let startY:number
let moveStartX:number
let moveStartY:number
let distantX:number
let distantY:number
// 判断是否为竖向滑动
let ifVertical = false
let ifHorizontal = false

// 是否允许滑动事件，在弹窗出现时阻止滑动事件
export let changePage = ref(true)
export function enableChangePage(){
	changePage.value = true
}
export function disableChangePage(){
	changePage.value = false
}
// 滑动事件本身
export const touchStart = (e)=>{
	if(!changePage.value){
		return false
	}
	startX = e.touches[0].clientX
	startY = e.touches[0].clientY
	moveStartX = startX
	touchStartTime = Date.now()
}
// 逐渐显示or逐渐隐藏
export function touchMove(e){
	if(!changePage.value){
		return false
	}
	// 若为竖直滑动，则不会显示页面
	if(ifVertical){
		return false 
	}
	// 否则禁止上下滑动
	e.preventDefault()
	
	
	// 移动距离
	let movingX = moveStartX - e.touches[0].clientX
	moveStartX = e.touches[0].clientX
	moveStartY = e.touches[0].clientY
	distantX = startX - moveStartX
	distantY = startY - moveStartY
	
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

export function touchEnd(e){
	if(!changePage.value){
		return false
	}
	
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
			if(moveDistant > rightMaxWidth/2 || slideSpeed > rpxShow){
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

// 隐藏动画
const hideAnimateTime = 15
const showAnimateTime = 10 //动画持续时间（单位帧）
export function hidePage(pageName:'left'|'right') {
	const showWidth = pageName=="left"? leftShowWidth:rightShowWidth
	const maxWidth = pageName=="left"? leftMaxWidth:rightMaxWidth
	// 动画运行速度
	const speed = Math.abs(maxWidth) / hideAnimateTime
	const reduce = () => {
		// 动画执行条件
		if (showWidth.value > 0) {
			// 结束动画
			if(showWidth.value - speed <= 0){
				showWidth.value = 0
				if(pageName == "left"){
					leftShowing = false
					hideMask()
				}
				else{
					rightShowing = false
				}
			}
			// 继续动画
			else{
				showWidth.value -= speed; // 控制时间在10帧内
				if(pageName == "left"){
					leftPageMask()
				}
				requestAnimationFrame(reduce); // 请求下一帧
			}	
		}
	};
	reduce();
	
	
}
// 显示动画
export function showPage(pageName:'left'|'right') {
	if(pageName == "left"){
		leftShowing = true
	}
	else{
		rightShowing = true
	}
	const showWidth = pageName=="left"? leftShowWidth:rightShowWidth
	const maxWidth = pageName=="left"? leftMaxWidth:rightMaxWidth
	const speed = maxWidth / showAnimateTime
	const reduce = () => {
		if (showWidth.value < maxWidth) {
			if(showWidth.value + speed >= maxWidth){
				showWidth.value = maxWidth
			}
			else{
				showWidth.value += speed; // 控制时间在10帧内
				if(pageName == "left"){
					leftPageMask()
				}
				requestAnimationFrame(reduce); // 请求下一帧
			}
			
		}
	};
	reduce();
}

// 左侧页面的遮罩层
function leftPageMask(){
	if(!ifMask.value){
		showMask(()=>{
			// 点击遮罩层隐藏左侧页面
			hidePage('left')
		})
	}
	
	const maskAlpha = maskAlphaMax * (leftShowWidth.value/leftMaxWidth)
	//同时逐渐改变遮罩层透明度
	changeMaskAlpha(maskAlpha)
}



 /* 获取滑动直线与水平线的夹角 */
function getLineAngle(x1, y1, x2, y2) {
    var x = x1 - x2,
    y = y1 - y2;
    if (!x && !y) {
        return 0;
    }
    var angle = (180 + Math.atan2(-y, -x) * 180 / Math.PI + 360) % 360;
    return 360 - angle;
}

