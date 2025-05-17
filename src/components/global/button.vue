<template>
<div class="button" 
    v-wave="{
        color:'grey',
		initialOpacity: 0.5,
		finalOpacity:0.2,
		easing: 'ease-in',
		duration:0.3,
		stopPropagation:true
    }"
    @pointerdown.stop 
    @click.stop="clickButton($event)" 
    :name="name"
    >
    <IconVue v-if="icon" 
        class="buttonIcon" 
        :icon
        :name
        :color
        :disabled>
    </IconVue>
    <span v-else-if="name">{{ name }}</span>
    <slot></slot>
</div>
</template>

<script setup lang='ts'>
    import { Icon} from '@/static/list/iconList';
    import IconVue from './Icon.vue';

    const {icon=null,name,disabled=false,color} = defineProps<{
        icon?:Icon|null,
        name?:string,
        disabled?:boolean,
        color?:string
    }>()
    const emits = defineEmits(["click"])
    
    //触发点击事件
    function clickButton(event:Event){
        emits("click",event)
    }
</script>

<style scoped lang='scss'>
.button{
    display: block;
    .buttonIcon{
        display: block;
        width: 100%;
        height: 100%;
    }
}
</style>