import { ref } from 'vue';
import managePx from "../../api/managePx"
import { changeMaskAlpha, hideMask, ifMask, maskAlphaMax, showMask } from './masks/pageMask';

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

// 控制项目页面显示
export let projectShowHeight = ref(0)
const projectMaxHeight = (window.innerHeight * 0.8)
export let projectShowing = false

// 切换项目页面的显示
export function switchProjectPage(){
	if(projectShowing){
		hidePage("project")
	}
	else{
		showPage("project")
		changePageMask('project')
	}
}

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
	changePageMask("left")
}

// 隐藏页面
const hideAnimateTime = 15
const showAnimateTime = 10 //动画持续时间（单位帧）
export function hidePage(pageName:'left'|'right'|'project') {
	switch(pageName){
		case "left":
			leftShowing = true
			var changeTarget = leftShowWidth
			var maxValue = leftMaxWidth
			var whileAnimating = ()=>changePageMask('left');
			break;
		case 'right':
			rightShowing = true
			var changeTarget = rightShowWidth
			var maxValue = rightMaxWidth
			break;
		case 'project':
			var changeTarget = projectShowHeight
			var maxValue = projectMaxHeight
			var whileAnimating = ()=>changePageMask('project')
			break;
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
				changeTarget.value -= speed; // 控制时间在10帧内
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
			var whileAnimating = ()=>changePageMask('left');
			break;
		case 'right':
			rightShowing = true
			var changeTarget = rightShowWidth
			var maxValue = rightMaxWidth
			break;
		case 'project':
			var changeTarget = projectShowHeight
			var maxValue = projectMaxHeight
			var whileAnimating = ()=>changePageMask('project')
			break;
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

// 控制页面遮罩层的显示与透明度
export function changePageMask(pageName:"left"|"project"){
	const persent = pageName == "left"? (leftShowWidth.value/leftMaxWidth) : (projectShowHeight.value/projectMaxHeight)
	//显示遮罩层，并设置点击事件为点击时隐藏
	if(!ifMask.value){
		showMask(()=>{
			// 点击遮罩层隐藏指定页面
			hidePage(pageName)
		})
	}
	//遮罩层透明度按比例变化
	const maskAlpha = maskAlphaMax * persent
	//同时逐渐改变遮罩层透明度
	changeMaskAlpha(maskAlpha)
}


