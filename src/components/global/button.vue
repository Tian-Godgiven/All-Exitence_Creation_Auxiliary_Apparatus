<template>
    <div class="button" @click.stop="clickButton($event)" :name="name">
        <img v-if="icon" class="buttonIcon" :src="src" :alt="name">
        <span v-else>{{ name }}</span>
        <slot></slot>
    </div>
</template>

<script setup lang='ts'>
    import { ButtonIcon, buttonIconList } from '@/data/list/buttonIconList';
import { computed } from 'vue';

    const {icon=null,name} = defineProps<{icon?:ButtonIcon|null,name:string}>()
    const emits = defineEmits(["click"])
    
    //获取图标
    let src = computed(()=>{
        if(icon){
            const iconImg = buttonIconList[icon]
            const img = "../../static/icon/" + iconImg
            return new URL(img,import.meta.url).href
        }
    })

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
            object-fit: contain;
        }
    }
</style>