<template>
<svg class="icon" 
    :class="disabled?'disabled':''" 
    v-show="ifShow" 
    :alt="name">
    <use :xlink:href="iconName" />
</svg>
</template>

<script setup lang='ts'>
    import { computed, Ref} from 'vue';
    import { Icon,iconList } from '@/static/list/iconList';
    const {icon,name,show=true,disabled=false} = defineProps<{
        icon:Icon,
        name?:string,
        show?:boolean|Ref<boolean>,
        disabled?:boolean
    }>()
    const emits = defineEmits(["click"])
    
    //获取图标名
    const iconName = computed(()=>{
        const fullName = iconList[icon]
        return "#icon-"+fullName
    })
    //是否显示
    const ifShow = computed(()=>{
        return show===true
    })

</script>

<style scoped lang='scss'>
.icon{
    fill:currentColor;
    &:not([fill]) { fill: currentColor; } 
    &.disabled{
        fill:#8f8f8f
    }
    use{
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
    
}
</style>