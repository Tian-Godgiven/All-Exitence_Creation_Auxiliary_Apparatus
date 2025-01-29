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
    import { ref,Ref, unref} from 'vue';
    const emits = defineEmits(["longtap","click"])
    //禁用模式
	const {disabled=false} = defineProps<{disabled?:Ref<boolean>|boolean}>()
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