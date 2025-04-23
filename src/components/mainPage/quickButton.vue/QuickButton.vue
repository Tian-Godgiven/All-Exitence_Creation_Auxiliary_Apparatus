<template>
<div class="quickButton">
    <div class="quickButtonPanel" ref="panelRef">
        <PanelLine :item v-for="item in quickPanelList"/>
    </div>
    <Button class="button" 
        :style="{transform: 'rotate(' + rotateDegree + 'deg)'}"
        name="快捷键"
        icon="rightUp"
        @click="switchQuickButton"></Button>
</div>

</template>

<script setup lang='ts'>
    import { ref } from 'vue';
    import Button from '@/components/global/Button.vue';
import gsap from 'gsap';
import PanelLine from './PanelLine.vue';
import { quickPanelList } from '@/hooks/pages/mainPage/quickButton';
    //列表


    //动画
    const rotateDegree = ref(0)//旋转角度
    let showing = false
	function switchQuickButton(){
		//旋转按键
		rotateDegree.value += 180
		//切换显示功能面板
        if(showing){
            hidePanel()
        }
        else{
            showPanel()
        }
        showing = !showing
	}
    function showPanel(){
        gsap.to(".quickButtonPanelLine",{
            duration: 0.3,
            scaleY: 1,
            ease: "power1.inOut",
            stagger: {
                grid: [5,1],
                from: "start",
                axis: "y",
                amount: 0.15,
            }
        })
    }
    function hidePanel(){
        gsap.to(".quickButtonPanelLine",{
            duration: 0.3,
            scaleY:0,
            ease: "power1.inOut",
            stagger: {
                grid: [5,1],
                from: "end",
                axis: "y",
                amount: 0.15,
            }
        })
    }

</script>

<style scoped lang='scss'>
.quickButton{
    position: absolute;
    right: 9vw;
    top:75vh;
    z-index: 1;
    .quickButtonPanel{
        position: absolute;
        display: flex;
        flex-direction: column-reverse;
        gap: 10px;
        bottom: 100%;
        right: 0;
    }
    .button{
        pointer-events: all;
        height: 110px;
        width: 110px;
        border-radius: 50%;
        background-color: $rightButtonColor;
        box-shadow: 0px 3px 6px 1px rgb(99, 99, 99);
        margin:15px;
        margin-top: 20px;
        flex-shrink: 0;
        transition: transform 0.8s ease;
    }
}
</style>