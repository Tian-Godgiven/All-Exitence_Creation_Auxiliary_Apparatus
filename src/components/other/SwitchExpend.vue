<template>
<div class="switchExpend" @click="switchExpend">
    <div class="title">
        <slot name="title"></slot>
    </div>
    <div class="inner" ref="inner">
        <slot name="inner"></slot>
    </div>
</div>
</template>

<script setup lang='ts'>
    import gsap from 'gsap';
import { ref } from 'vue';
    const {startExpend=true} = defineProps<{startExpend?:boolean}>()
    const expend = ref(startExpend)
    const inner = ref()
    function switchExpend(){
        if(!inner.value)return false
        //收起
        if(expend.value){
            gsap.to(inner.value,{
                height:0,
                type:"easeInOut",
                duration:1
            })
        }
        //展开
        else{
            gsap.to(inner.value,{
                height:"fit-content",
                type:"easeInOut",
                duration:1
            })
        }
        expend.value = !expend.value
    }
</script>

<style scoped lang='scss'>
.inner{
    overflow: hidden;
}
</style>