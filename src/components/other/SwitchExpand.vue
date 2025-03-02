<template>
<div class="switchExpand">
    
    <div class="title" @click="switchExpand">
        <div class="icon" :class="expand?'expand':'unexpand'"></div>
        <slot class="content" name="title"></slot>
    </div>
    <div class="inner" ref="inner">
        <slot name="inner"></slot>
    </div>
    
</div>
</template>

<script setup lang='ts'>
    import gsap from 'gsap';
    import { ref } from 'vue';
    const {startExpand=true} = defineProps<{startExpand?:boolean}>()
    const expand = ref(startExpand)
    const inner = ref()
    function switchExpand(){
        if(!inner.value)return false
        //收起
        if(expand.value){
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
        expand.value = !expand.value
    }
</script>

<style scoped lang='scss'>
.switchExpand{
    .title{
        display: flex;
        .icon{
            width: 40px;
            height: 40px;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            &.expand{
                background-image: url("@/static/icon/expandDown.svg");
            }
            &.unexpand{
                background-image: url("@/static/icon/expandRight.svg");
            }
        } 
        >:not(.icon){
            flex-grow: 1;
        }
    }
        .inner{
            margin-left: 20px;
            overflow: hidden;
        }
    
}


</style>