<template>
<div class="controlPanel" ref="panelRef">
    <div class="title" v-if="control.title">{{control.title}}</div>
    <div class="inner">
        <Button class="option" :class="{ danger: option.danger }" v-for="option in control.option"  @click="clickControl(option)">
            {{ option.text }}
        </Button>
    </div>
</div>
</template>

<script setup lang='ts'>
    import { Control } from '@/hooks/controlPanel';
import { closePopUp } from '@/hooks/pages/popUp';
import Button from '@/components/global/button.vue';
	import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue';
    const {props,popUp,returnValue} = defineProps(["props","popUp","returnValue"])
    const {control}:{control:Control} = props
	const panelRef = useTemplateRef("panelRef")
	onMounted(()=>{
		document.addEventListener("pointerdown", closeOnOutside, true)
		document.addEventListener("click", closeOnOutside, true)
		document.addEventListener("contextmenu", closeOnOutside, true)
	})
	onBeforeUnmount(()=>{
		document.removeEventListener("pointerdown", closeOnOutside, true)
		document.removeEventListener("click", closeOnOutside, true)
		document.removeEventListener("contextmenu", closeOnOutside, true)
	})
	function closeOnOutside(event:Event){
		if(panelRef.value && !panelRef.value.contains(event.target as Node)){
			closePopUp(popUp)
		}
	}
    //点击控制面板的项目
    function clickControl(option:Control["option"][0]){
        //获取返回值
        const value = option.click()
        if(returnValue){
            returnValue(value)
        } 
        //关闭控制面板
        closePopUp(popUp)
    }
</script>

<style scoped lang='scss'>
.controlPanel{
	width: 100%;
	min-width: 160px;
    .title{
		padding: 10px 12px 6px;
		font-size: 1rem;
		font-weight: 600;
    }
    .inner{
		padding: 4px;
        .option{
			display: block;
			width: 100%;
			box-sizing: border-box;
			text-align: left;
            font-size: 1rem;
			padding: 8px 12px;
			transition: background-color 0.15s ease;
            &.danger{ color: $dangerColor; }
			&:hover{
				background-color: $bgColor90;
			}
        }
    }
    
}
</style>
