<template>
<svg class="icon" 
    v-if="icon"
    :class="disabled?'disabled':''" 
    v-show="ifShow" 
    :alt="name">
    <use :xlink:href="iconName" />
</svg>
<img v-else :src="iconSrc" :alt="name" />
</template>

<script setup lang='ts'>
    import { computed, Ref} from 'vue';
    import { Icon,iconList } from '@/static/list/iconList';
    type IconProps = 
    | { icon: Icon; iconPath?: never }  // 如果有 icon，iconPath 不能存在
    | { icon?: never; iconPath: string };  // 如果有 iconPath，icon 不能存在

    const { icon, iconPath, name, show = true, disabled = false } = defineProps<{
        icon?: Icon;
        iconPath?: string;
        name?: string;
        show?: boolean | Ref<boolean>;
        disabled?: boolean;
    } & IconProps>();
    const emits = defineEmits(["click"])
    
    //获取图标名
    const iconName = computed(()=>{
        if(icon){
            const fullName = iconList[icon]
            return "#icon-"+fullName
        }
    })
    //获取图标文件
    const iconSrc = computed(()=>{
        if(iconPath){
            const tmp = new URL(`../../${iconPath}`,import.meta.url).href
            return tmp
        }
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