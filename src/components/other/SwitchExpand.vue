<template>
<div class="switchExpand">
    <div class="title" v-wave="{
        color:'grey',
		initialOpacity: 0.5,
		finalOpacity:0.2,
		easing: 'ease-in',
		duration:0.3,
		stopPropagation:true
    }" @click="switchExpand">
        <Icon class="icon" :icon="expand?'expand':'unexpand'"></Icon>
        <slot class="content" name="title"></slot>
    </div>
    <div class="inner" ref="inner">
        <slot name="inner"></slot>
    </div>
</div>
</template>

<script setup lang='ts'>
    import gsap from 'gsap';
    import { onMounted, Ref, ref, useTemplateRef } from 'vue';
    import Icon from '../global/Icon.vue';
    const {startExpand=true,expandRef} = defineProps<{
        expandRef?:Ref<boolean>,
        startExpand?:boolean
    }>()
    let expand:Ref<boolean>
    if(expandRef){
        expand = expandRef
    }
    else{
        expand = ref(startExpand)
    }
    const inner = useTemplateRef("inner")
    onMounted(()=>{
        gsap.set(inner.value,{
            height:expand.value?"auto":0
        })
    })
    
    function switchExpand(){
        if(!inner.value)return false
        //收起
        if(expand.value){
            gsap.to(inner.value,{
                height:0,
                ease:"power2.inOut",
                duration:1
            })
        }
        //展开
        else{
            gsap.to(inner.value,{
                height:"auto",
                ease:"power2.inOut",
                duration:1
            })
        }
        expand.value = !expand.value
    }
    
</script>

<style scoped lang='scss'>
.switchExpand{
    .title{
        align-items: center;
        display: flex;
        .icon{
            width: 40px;
            height: 40px;
        } 
        >:not(.icon){
            flex-grow: 1;
        }
    }
    .inner{
        overflow: hidden;
    }
    
}


</style>