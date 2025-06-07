<template>
<div class="switchExpand">
    <div class="title"  @click="switchExpand">
        <div v-if="noWave">
            <Icon class="icon" :icon="expand?'expand':'unexpand'"></Icon>
            <slot class="content" name="title"></slot>
        </div>
        <div v-else v-wave="noWave?false:{
            color:'grey',
            initialOpacity: 0.5,
            finalOpacity:0.2,
            easing: 'ease-in',
            duration:0.3,
            stopPropagation:true, 
        }">
            <Icon class="icon" :icon="expand?'expand':'unexpand'"></Icon>
            <slot class="content" name="title"></slot>
        </div>
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
    const {startExpand=true,expandRef,noWave=false} = defineProps<{
        expandRef?:Ref<boolean>,
        startExpand?:boolean,
        noWave?:boolean
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
        >div{
            height: 100%;
            align-items: center;
            display: flex;
            .icon{
                flex-shrink: 0;
                width: 40px;
                height: 40px;
            } 
            >:not(.icon){
                min-height: 40px;
                width: calc(100% - 40px);
            }
        }
        
        
    }
    .inner{
        overflow: hidden;
    }
    
}


</style>