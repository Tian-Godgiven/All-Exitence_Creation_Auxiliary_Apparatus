<template>
<svg class="icon" 
    v-if="icon"
    :class="[disabled?'disabled':'', `size-${size}`]" 
    v-show="ifShow" 
    :style="iconStyle"
    :alt="name">
    <use :xlink:href="iconName" />
</svg>
</template>

<script setup lang='ts'>
    import { computed, Ref} from 'vue';
    import { Icon,iconList } from '@/static/list/iconList';
    const { icon, color, name, show = true, disabled = false, size = "normal" } = defineProps<{
        icon?: Icon;
        color?: string;
        name?: string;
        show?: boolean | Ref<boolean>;
        disabled?: boolean;
        size?: "small"|"normal"|"big"|"large"|string;
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
    const iconStyle = computed(()=>{
        const presetSizes = ["small","normal","big","large"]
        if(presetSizes.includes(size)){
            return {color}
        }
        return {color,width:size,height:size}
    })

</script>

<style scoped lang='scss'>
.icon{
	width: 24px;
	height: 24px;
	color: $textColor;
	flex: 0 0 auto;
	&.size-small{ width: 16px; height: 16px; }
	&.size-big{ width: 28px; height: 28px; }
	&.size-large{ width: 32px; height: 32px; }
    &.disabled{
		color: $previewText;
    }
    use{
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
}

@media (min-width: 900px){
	.icon{
		width: 20px;
		height: 20px;
		&.size-small{ width: 14px; height: 14px; }
		&.size-big{ width: 24px; height: 24px; }
		&.size-large{ width: 28px; height: 28px; }
	}
}
</style>
