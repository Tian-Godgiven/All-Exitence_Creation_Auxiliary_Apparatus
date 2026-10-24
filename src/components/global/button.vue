<template>
<div class="button" :class="{loading, disabled, bordered}"
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
        :disabled
        :size="iconSize">
    </IconVue>
    <span v-else-if="name">{{ name }}</span>
    <slot></slot>
</div>
</template>

<script setup lang='ts'>
    import { Icon} from '@/static/list/iconList';
    import IconVue from './Icon.vue';

    const {icon=null,name,disabled=false,color,loading=false,bordered=false,iconSize="normal"} = defineProps<{
        icon?:Icon|null,
        name?:string,
        disabled?:boolean,
        color?:string
        loading?:boolean
        bordered?:boolean
        iconSize?:"small"|"normal"|"big"|"large"|string
    }>()
    const emits = defineEmits(["click"])
    
    //触发点击事件
    function clickButton(event:Event){
        if(disabled || loading)return
        emits("click",event)
    }
</script>

<style scoped lang='scss'>
.button{
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.15s ease, opacity 0.15s ease;
    .buttonIcon{ display: block; }
	&:not(.disabled):not(.loading):hover{
		background-color: $bgColor90;
	}
	&.disabled{
		cursor: default;
		opacity: 0.5;
	}
	&.bordered{
		box-sizing: border-box;
		border: 2px solid black;
		border-radius: 6px;
	}
    &.loading::after{
        content: "";
        position: absolute;
        inset: 28%;
        border: 2px solid currentColor;
        border-right-color: transparent;
        border-radius: 50%;
        animation: buttonLoading 0.7s linear infinite;
    }
}

@keyframes buttonLoading {
    to { transform: rotate(360deg); }
}
</style>
