import { ref } from 'vue';
import managePx from "../api/managePx"
import { changeMaskAlpha, hideMask, ifMask, maskAlphaMax, showMask } from './leftPageMask';

// 是否允许切换左右页面事件，在弹窗出现时阻止滑动事件
export const changePage = ref(true)
export function enableChangePage(){
	changePage.value = true
}
export function disableChangePage(){
	changePage.value = false
}

// 控制左侧页面显示
export let leftShowWidth = ref(0) //左侧显示的宽度，页面本身的宽度固定
export const leftMaxWidth = managePx(650) //左侧页面最大宽度
export let leftShowing = false

// 控制右侧页面显示
export let rightShowWidth = ref(0)
export const rightMaxWidth = managePx(150)
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
export function leftPageMask(){
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


