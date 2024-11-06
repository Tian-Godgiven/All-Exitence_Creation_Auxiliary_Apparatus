<template>
<view class="full" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
		
	<!-- 首页顶部 -->
	<view class="titleBar">
		<view class="title">
			<button @click="showLeft()">左侧按键</button>
			<view>文件名</view>
		</view>
		<view class="titleButton">
			<button>右侧按键A</button>
		</view>
	</view>
	
	<!-- 首页内容 -->
	<view>首页</view>
	
	<!-- 左侧页面-->
	<leftPageVue ref="leftPage" 
		:showWidth="leftShowWidth" 
		:maxWidth="leftMaxWidth">
	</leftPageVue>
	
	<!-- 右滑页面 -->
	<rightPageVue ref="rightPage" 
		:showWidth="rightShowWidth" 
		:maxWidth="rightMaxWidth">
	</rightPageVue>

</view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import leftPageVue from '../../components/leftPage/leftPage.vue';
import rightPageVue from '../../components/rightPage/rightPage.vue';
import { rpxToPx } from '../../api/rpxToPx';

	// 控制左侧页面显示
	let leftPage = ref() //左侧页面
	let leftShowWidth = ref(0) //左侧显示的宽度，页面本身的宽度固定
	let leftMaxWidth = rpxToPx(650) //左侧页面最大宽度
	let leftShowing = false
	
	// 控制右侧页面显示
	let rightPage = ref()
	let rightShowWidth = ref(1)
	let rightMaxWidth = rpxToPx(300)
	let rightShowing = false
	// 监听滑动事件
	let startX:number
	let moveStartX:number
	let distantX:number
	function touchStart(e){
		startX = e.touches[0].clientX
		moveStartX = startX
	}
	function touchMove(e){
		// 移动距离
		let movingX = moveStartX - e.touches[0].clientX
		moveStartX = e.touches[0].clientX
		distantX = startX - moveStartX
		// [向左滑] aka [右滑]:左侧界面的隐藏优先级更高
		if(distantX > 0){
			console.log(leftShowing,!rightShowing)
			// 如果此时左侧界面已显示，则减少其width，不低于0（逐渐隐藏）
			if(leftShowing){
				leftShowWidth.value = Math.max(leftShowWidth.value - movingX, 0);
			}
			// 如果此时右侧界面未显示，则增加其width（逐渐显示）
			else if(!rightShowing){
				console.log(leftShowing,!rightShowing)
				rightShowWidth.value = Math.min(rightShowWidth.value + movingX, rightMaxWidth);
			}
		}
		// [向右滑] aka [左滑]:左侧界面的显示优先级更高
		else if(distantX < 0){
			console.log(!leftShowing,rightShowing)
			// 如果此时左侧界面未显示，则增加其width（逐渐显示）
			if(!leftShowing){
				leftShowWidth.value = Math.min(leftShowWidth.value - movingX, leftMaxWidth)
			}
			// 如果此时右侧界面已显示，则减少其width,不低于0（逐渐隐藏）
			else if(rightShowing){
				rightShowWidth.value = Math.max(rightShowWidth.value + movingX, 0);
			}
		}
	}
	function touchEnd(e){
		// [向左滑] aka [右滑]
		if(distantX > 0){
			//如果向左滑动幅度>100，则令左侧隐藏
			if(leftShowWidth.value > rpxToPx(100)){
				hidePage("left")
				leftShowing = false
			}
			//如果右侧滑动幅度>100，则令右侧显示
			else if(rightShowWidth.value > rpxToPx(100)){
				showPage("right")
				rightShowing = true
			}
		}
		// [向右滑] aka [左滑]
		else if(distantX < 0){
			//如果向右滑动幅度>100，则令其显示
			if(leftShowWidth.value > rpxToPx(100)){
				showPage("left")
				leftShowing = true
			}
			//如果右侧滑动幅度>100，则令右侧隐藏
			else if(rightShowWidth.value > rpxToPx(100)){
				hidePage("right")
				rightShowing = false
			}
		}
		
		// //如果右侧宽度小于100，则令其
		// if(rightShowWidth.value < 100){
		// 	hidePage(rightPage)
		// }
		// else{
		// 	showPage(rightPage,rightMaxWidth)
		// }
	}
	
	// 隐藏动画
	function hidePage(pageName:string) {
		const showWidth = pageName=="left"? leftShowWidth:rightShowWidth
		const maxWidth = pageName=="left"? leftMaxWidth:rightMaxWidth
		const speed = Math.abs(showWidth.value - maxWidth) / 10
		const reduce = () => {
			if (showWidth.value > 0) {
				showWidth.value -= speed; // 控制时间在10帧内
				requestAnimationFrame(reduce); // 请求下一帧
			}
		};
		reduce();
	}
	// 显示动画
	function showPage(pageName:string) {
		const showWidth = pageName=="left"? leftShowWidth:rightShowWidth
		const maxWidth = pageName=="left"? leftMaxWidth:rightMaxWidth
		const speed = Math.abs(maxWidth) / 10
		const reduce = () => {
			if (showWidth.value < maxWidth) {
				showWidth.value += speed; // 控制时间在10帧内
				requestAnimationFrame(reduce); // 请求下一帧
			}
		};
		reduce();
		
	}
	
</script>

<style lang="scss">
	.full{
		width: 100vw;
		height: 100vh;
	}
	.titleBar{
		width: 100%;
		height: 110rpx;
		display: flex;
		.title{
			width: 70%;
			height: 100%;
			display: flex;
		}
		.titleButton{
			width: 30%;
			height: 100%;
			display: flex;
		}
	}
</style>
