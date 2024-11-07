import { ref } from 'vue';
import { rpxToPx } from "../api/rpxToPx"
import rightPageVue from '../components/rightPage/rightPage.vue';
import { changeMaskAlpha, hideMask, maskAlphaMax, showMask } from './mask';

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
}

const rpxShow = rpxToPx(200) // 滑动显示阈值
const rpxHide = rpxToPx(300) // 滑动隐藏阈值
const rpxSpeed = rpxToPx(2) // 滑动速度阈值

// 监听滑动事件
let touchStartTime = 0
let startX:number
let moveStartX:number
let distantX:number
let ifShowMask = false

export function touchStart(e){
	startX = e.touches[0].clientX
	moveStartX = startX
	touchStartTime = Date.now()
}
// 逐渐显示or逐渐隐藏
export function touchMove(e){
	// 移动距离
	let movingX = moveStartX - e.touches[0].clientX
	moveStartX = e.touches[0].clientX
	distantX = startX - moveStartX
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
			if(!ifShowMask){
				showMask()
				ifShowMask = true
			}
		}
	}
}

export function touchEnd(e){
	let touchEndTime = Date.now()
	let moveDistant = distantX
	let moveTime = touchEndTime - touchStartTime
	
	startX = 0
	distantX = 0

	let slideSpeed = Math.abs(moveDistant) / moveTime
	// [向左滑] aka [右滑]
	if(moveDistant > 10){
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
	else if(moveDistant < -10){
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
export function hidePage(pageName:string) {
	const showWidth = pageName=="left"? leftShowWidth:rightShowWidth
	const maxWidth = pageName=="left"? leftMaxWidth:rightMaxWidth
	// 动画运行速度
	const speed = Math.abs(maxWidth) / hideAnimateTime
	const reduce = () => {
		if (showWidth.value > 0) {
			if(showWidth.value - speed <= 0){
				showWidth.value = 0
				if(pageName == "left"){
					leftPageMask()
				}
			}
			else{
				showWidth.value -= speed; // 控制时间在10帧内
				requestAnimationFrame(reduce); // 请求下一帧
			}	
		}
	};
	reduce();
	
	if(pageName == "left"){
		leftShowing = false
		hideMask()
		ifShowMask = false   
	}
	else{
		rightShowing = false
	}
}
// 显示动画
export function showPage(pageName:string) {
	const showWidth = pageName=="left"? leftShowWidth:rightShowWidth
	const maxWidth = pageName=="left"? leftMaxWidth:rightMaxWidth
	const speed = maxWidth / showAnimateTime
	const reduce = () => {
		if (showWidth.value < maxWidth) {
			if(showWidth.value + speed >= maxWidth){
				showWidth.value = maxWidth
				if(pageName == "left"){
					leftPageMask()
				}
			}
			else{
				showWidth.value += speed; // 控制时间在10帧内
				requestAnimationFrame(reduce); // 请求下一帧
			}
			
		}
	};
	reduce();
	
	if(pageName == "left"){
		leftShowing = true
	}
	else{
		rightShowing = true
	}
}

function leftPageMask(){
	const maskAlpha = maskAlphaMax * (leftShowWidth.value/leftMaxWidth)
	//同时逐渐改变遮罩层透明度
	changeMaskAlpha(maskAlpha)
}

