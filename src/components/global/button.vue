<template>
<div class="button" @pointerdown.stop @click.stop="clickButton($event)" :name="name">
    <IconVue v-if="icon" 
        class="buttonIcon" 
        :icon
        :name
        :disabled>
    </IconVue>
    <span v-else>{{ name }}</span>
    <slot></slot>
</div>
</template>

<script setup lang='ts'>
    import { Icon} from '@/static/list/iconList';
    import IconVue from './Icon.vue';

    const {icon=null,name,disabled=false} = defineProps<{icon?:Icon|null,name:string,disabled?:boolean}>()
    const emits = defineEmits(["click"])
    
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