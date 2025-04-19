<template>
<div 
	v-wave="{
		color:'grey',
		initialOpacity: 0.5,
		easing: 'ease-in',
		duration:0.5,
		stopPropagation:true
	}"
	@pointerdown.stop="touchStart"
	@pointerup="touchEnd" >
	<slot></slot>
</div>
</template>

<script setup lang='ts'>
    import { LongTapAndClickTouchEnd, LongTapAndClickTouchStart } from '@/api/longTapAndClick';
    import { ref, unref} from 'vue';
    //禁用模式
	const {disabled=false,longTap,click} = defineProps<{
		disabled?:boolean,
		longTap:()=>void,
		click:()=>void
	}>()
    //长按和点击
	const ifLongTap = ref(false)
	let timeout:any 
	//处理点击和长按事件
	function touchStart(){
		if(unref(disabled)){return;}
		timeout = LongTapAndClickTouchStart(ifLongTap)
	}
	function touchEnd(){
		if(unref(disabled)){return;}
		LongTapAndClickTouchEnd({
			theTimeOut:timeout,
			ifLongTap,
			//执行长按事件
			longTap:()=>{
				longTap()
			},
			//执行点击事件
			click:()=>{
				click()
			}
		})
	}
</script>

<style scoped lang='scss'>

</style>