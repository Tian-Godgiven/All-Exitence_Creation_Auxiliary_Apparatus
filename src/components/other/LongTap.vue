<template>
<div 
	v-wave="{
		color:'grey',
		initialOpacity: 0.5,
		finalOpacity:0.2,
		easing: 'ease-in',
		duration:(duration/1000),
		stopPropagation:true,
		tagName:'section'
	}"
	ref="selfRef"
	@pointerdown.stop="touchStart">
	<slot></slot>
</div>
</template>

<script setup lang='ts'>
    import gsap from 'gsap';
	import { unref, useTemplateRef} from 'vue';
    //禁用模式
	const {disabled=false,longTap,click,waitAfter=0,duration=500} = defineProps<{
		waitAfter?:number,//长按时间超过该数值后，才开始计算长按时间
		duration?:number,
		disabled?:boolean,
		longTap:()=>void,
		click?:()=>void
	}>()
    //长按和点击
	let timeout:number|false
	const selfRef = useTemplateRef("selfRef")
	//点击持续状态
	let touching:boolean = false
	//记录的点击位置
	let lastPointerPosition:{x:number,y:number}|null = null;
	//阻止wave效果
	let stopWave = false
	//点击开始
	function touchStart(e:PointerEvent){
		if(unref(disabled))return;
		if(touching)return
		touching = true
		timeout = Date.now()
		//如果设置了等待时间
		if(waitAfter!==0||stopWave){
			stopWave = false//只阻止一次
			//阻止即时触发波动
			e.stopImmediatePropagation()
			//记录点击位置
			lastPointerPosition = {
				x: e.clientX,
				y: e.clientY
			};
			setTimeout(()=>{
				waitUntil()
			},waitAfter)
		}
		document.addEventListener("pointerup",touchEnd)
	}
	//长按一段时间后
	function waitUntil(){
		//如果点击提前结束了,撤销计时器
		if(!touching)return;
		//重新触发一次波动（pointerdown）
		if(!selfRef.value||!lastPointerPosition)return;
		const newPointerEvent = new PointerEvent('pointerdown', {
			clientX: lastPointerPosition.x,
			clientY: lastPointerPosition.y,
		});
		// 在元素上触发新的pointerdown事件,这一次因为已经开始了touching所以不会被阻止
		selfRef.value.dispatchEvent(newPointerEvent);
	}
	function touchEnd(e:PointerEvent){
		if(unref(disabled))return;
		if(!selfRef.value)return;
		if(!timeout)return;
		if(e.target instanceof Node){
			if(selfRef.value.contains(e.target)){
				//判断时间是否足够
				const timeDis = Date.now() - timeout
				if(timeDis > duration+waitAfter){
					longTap()
				}
				//长按时间不足，阻止进一步的动画
				else if(waitAfter!==0 && timeDis>waitAfter){
					stopWave = true
					e.stopImmediatePropagation()
					//移除蒙版元素,其在上方被定义为section标签
					const wave = selfRef.value.getElementsByTagName('section')[0]
					gsap.to(wave,{
						opacity:0,
						duration:0.8,
						onComplete:()=>{
							if(selfRef.value)
							selfRef.value.removeChild(wave);
						}
					})
				}
				else if(click){
					click()
				}
			}
		}
		//删除监听器
		timeout = false
		touching = false
		document.removeEventListener("pointerup",touchEnd)
	}
	

</script>

<style scoped lang='scss'>

</style>