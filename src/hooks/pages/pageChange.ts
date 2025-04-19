import { ref } from 'vue';
import managePx from "../../api/managePx"

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
export let leftShowing = false//左侧页面是否完全显示
// 显示左侧页面
export function showLeft(){
	showPage("left")
	changePageMaskWithPage("left")
}

// 控制右侧页面显示
export let rightShowWidth = ref(0)
export const rightMaxWidth = window.innerWidth * 0.7
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

// 控制项目页面显示
export const ifShowProject = ref(false)
export function showProjectPage(){
	ifShowProject.value = true
}
export function hideProjectPage(){
	ifShowProject.value = false
}
// 切换项目页面的显示
export function switchProjectPage(){
	if(!ifShowProject.value){
		showProjectPage()
	}
	else{
		hideProjectPage()
	}
}




// 隐藏页面
const hideAnimateTime = 30
const showAnimateTime = 15 //动画持续时间（单位帧）
export function hidePage(pageName:'left'|'right'|'project') {
	switch(pageName){
		case "left":
			leftShowing = false
			var changeTarget = leftShowWidth
			var maxValue = leftMaxWidth
			var whileAnimating = ()=>changePageMaskWithPage('left');
			break;
		case 'right':
			rightShowing = false
			var changeTarget = rightShowWidth
			var maxValue = rightMaxWidth
			var whileAnimating = ()=>changePageMaskWithPage('right');
			break;
		case 'project':
			hideProjectPage()
			return;
	}
	// 动画运行速度
	const speed = Math.abs(maxValue) / hideAnimateTime
	const reduce = () => {
		// 动画执行条件
		if (changeTarget.value > 0) {
			if(changeTarget.value - speed <= 0){
				changeTarget.value = 0
				hideMask()
			}
			else{
				changeTarget.value -= speed;
				if(whileAnimating){whileAnimating()}
				requestAnimationFrame(reduce); // 请求下一帧
			}
		}
	};
	reduce();
}
// 显示页面
export function showPage(pageName:'left'|'right'|'project') {
	switch(pageName){
		case "left":
			leftShowing = true
			var changeTarget = leftShowWidth
			var maxValue = leftMaxWidth
			var whileAnimating = ()=>changePageMaskWithPage('left');
			break;
		case 'right':
			rightShowing = true
			var changeTarget = rightShowWidth
			var maxValue = rightMaxWidth
			var whileAnimating = ()=>changePageMaskWithPage('right');
			break;
		case 'project':
			showProjectPage()
			return;
	}

	// 每帧移动速度
	const speed = Math.abs(maxValue) / showAnimateTime
	const reduce = () => {
		if (changeTarget.value < maxValue) {
			if(changeTarget.value + speed >= maxValue){
				changeTarget.value = maxValue
			}
			else{
				changeTarget.value += speed; // 控制时间在10帧内
				if(whileAnimating){whileAnimating()}
				requestAnimationFrame(reduce); // 请求下一帧
			}
		}
	};
	reduce();
}

// 控制左右两侧页面显示时的遮罩层透明度变化
export function changePageMaskWithPage(pageName:"left"|"right"){
	const clickMask = ()=>hidePage(pageName)
	const percent = pageName=='left'?leftShowWidth.value/leftMaxWidth:rightShowWidth.value/rightMaxWidth
	changePageMask(percent,clickMask)
}

// 控制页面遮罩层的显示与透明度
export function changePageMask(maskAlphaPercent:number,clickMask?:()=>void){
	//显示遮罩层，并设置点击事件为点击时隐藏
	if(!ifMask.value && clickMask){
		showMask(()=>{
			clickMask()
		})
	}
	//遮罩层透明度按比例变化
	const maskAlpha = maskAlphaMax * maskAlphaPercent
	//同时逐渐改变遮罩层透明度
	changeMaskAlpha(maskAlpha)
}

export let ifMask = ref(false)
export let maskAlpha = ref(0.6)
export const maskAlphaMax = 0.6

let clickEvent:()=>void

export function showMask(func:()=>void){
	ifMask.value = true
	clickEvent = func
}
export function hideMask(){
	ifMask.value = false
}
export function changeMaskAlpha(newAlpha:number){
	newAlpha.toFixed(2)
	maskAlpha.value = newAlpha
	if(newAlpha==0){
		hideMask()
	}
}
export function clickMask(){
	clickEvent()
}
