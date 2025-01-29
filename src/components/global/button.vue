<template>
    <div class="button" @click="clickButton($event)" :name="name">
        <img v-if="icon" class="buttonIcon" :src="src" :alt="name">
        <slot></slot>
    </div>
</template>

<script setup lang='ts'>
    import { ButtonIcon, buttonIconList } from '@/data/list/buttonIconList';

    const {icon=null,name} = defineProps<{icon?:ButtonIcon|null,name:string}>()
    const emits = defineEmits(["click"])
    
    //获取图标
    let src:string
    if(icon){
        const iconImg = buttonIconList[icon]
        const img = "../../static/icon/" + iconImg
        src = new URL(img,import.meta.url).href
    }
    
    

    //触发点击事件
    function clickButton(event:Event){
        emits("click",event)
    }
</script>

<style scoped lang='scss'>
    .button{
        .buttonIcon{
            width: 100%;
            height: 100%;
        }
    }
</style>