<template>
    <div>
        <div class="titleBar">
			<div class="titleButtons">
				<div class="button" 
					v-show="!manageMode"
					v-for="button in buttons" 
					@click="clickButton($event,button)">
					{{ button.text }}
				</div>
				<div class="titleButtons" v-show="manageMode">
					<slot name="manageMode"></slot>
				</div>
			</div>
			<div class="titleName" 			
				@touchstart="touchStart"
				@touchend="touchEnd"
				@mousedown="touchStart"
				@mouseup="touchEnd">
				<slot name="title"></slot>
			</div>
		</div>
		<div class="inner" v-show="expending">
            <slot name="inner"></slot>
		</div>
    </div>
</template>

<script setup lang='ts'>
    import { LongTapAndClickTouchEnd, LongTapAndClickTouchStart } from '@/api/longTapAndClick';
	import { ref,inject } from 'vue';
	const expending = ref(true)
	const {buttons} = defineProps(["buttons"])
	const emits = defineEmits(["longTap"])

	//管理模式
	const manageMode:any = inject("manageMode",false)
	//长按和点击
	const ifLongTap = ref(false)
	let timeout:any 
	//处理点击和长按事件
	function touchStart(){
		if(manageMode.value){
			return;
		}
		timeout = LongTapAndClickTouchStart(ifLongTap)
	}
	function touchEnd(){
		LongTapAndClickTouchEnd({
			theTimeOut:timeout,
			ifLongTap,
			//执行长按事件
			longTap:()=>{
				emits("longTap")
			},
			//点击切换折叠与否
			click:()=>{
				expending.value = !expending.value
			}
		})
	}

	function clickButton(event:Event,button:{text:string,click:()=>void}){
		event.stopPropagation()
		button.click()
	}
</script>

<style scoped lang='scss'>
</style>