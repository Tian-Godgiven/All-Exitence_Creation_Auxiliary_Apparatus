<template>
    <div 
        @mousedown="touchStart"
        @touchstart="touchStart" 
        @mouseup="touchEnd"
        @touchend="touchEnd">
        <slot></slot>
    </div>
</template>

<script setup lang='ts'>
    import { LongTapAndClickTouchEnd, LongTapAndClickTouchStart } from '@/api/longTapAndClick';
    import { ref,inject } from 'vue';
    const emits = defineEmits(["longtap","click"])
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
				emits("longtap")
			},
			//执行点击事件
			click:()=>{
				emits("click")
			}
		})
	}
</script>

<style scoped lang='scss'>

</style>