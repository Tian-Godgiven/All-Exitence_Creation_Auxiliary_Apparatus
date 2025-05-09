<template>
<div 
	v-wave="{
		color:'grey',
		initialOpacity: 0.5,
		finalOpacity:0.2,
		easing: 'ease-in',
		duration:0.5,
		stopPropagation:true
	}"
	ref="selfRef"
	@pointerdown.stop="touchStart"
	@pointerup="touchEnd" >
	<slot></slot>
</div>
</template>

<script setup lang='ts'>
    import { unref, useTemplateRef} from 'vue';
    //禁用模式
	const {disabled=false,longTap,click} = defineProps<{
		disabled?:boolean,
		longTap:()=>void,
		click?:()=>void
	}>()
    //长按和点击
	let timeout:number|false
	const selfRef = useTemplateRef("selfRef")
	//处理点击和长按事件
	function touchStart(){
		if(unref(disabled)){return;}
		timeout = Date.now()
		//监听弹起事件
		document.addEventListener("pointerup",touchEnd)
	}
	function touchEnd(e:PointerEvent){
		if(unref(disabled))return;
		if(!selfRef.value)return;
		if(!timeout)return;
		if(e.target instanceof Node){
			if(selfRef.value.contains(e.target)){
				//判断时间是否足够
				const timeDis = Date.now() - timeout
				if(timeDis > 500){
					longTap()
				}
				else{
					if(click){
						click()
					}
				}
			}
		}
		//删除监听器
		timeout = false
		document.removeEventListener("pointerup",touchEnd)
	}

</script>

<style scoped lang='scss'>

</style>