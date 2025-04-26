<template>
<svg class="icon" 
    v-if="icon"
    :class="disabled?'disabled':''" 
    v-show="ifShow" 
    :style={color:color}
    :alt="name">
    <use :xlink:href="iconName" />
</svg>
</template>

<script setup lang='ts'>
    import { computed, Ref} from 'vue';
    import { Icon,iconList } from '@/static/list/iconList';
    const { icon, color, name, show = true, disabled = false } = defineProps<{
        icon?: Icon;
        color?: string;
        name?: string;
        show?: boolean | Ref<boolean>;
        disabled?: boolean;
    }>();
    const emits = defineEmits(["click"])
    
    //获取图标名
    const iconName = computed(()=>{
        if(icon){
            const fullName = iconList[icon]
            return "#icon-"+fullName
        }
    })
    //是否显示
    const ifShow = computed(()=>{
        return show===true
    })

</script>

<style scoped lang='scss'>
.icon{
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