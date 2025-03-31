<template>
<div class="slidePage" ref="page">
    <slot></slot>
</div>
</template>

<script setup lang='ts'>
    import gsap from 'gsap';
import { ref, useTemplateRef, watchEffect } from 'vue';

    const {show} = defineProps<{show:boolean}>()
    //显示与隐藏该页面的动画
    const pageRef = useTemplateRef("page")
    watchEffect(()=>{
        if(!pageRef.value)return;
        if(show){
            gsap.to(pageRef.value,{
                x:0,
                duration:0.5,
                ease:"power2.inOut"
            })
        }
        else{
            gsap.to(pageRef.value,{
                x:"100%",
                duration:0.5,
                ease:"power2.inOut"
            })
        }
    })
</script>

<style scoped lang='scss'>
.slidePage{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: white;
    transform: translate(100%,0);
    padding: inherit;
}
</style>