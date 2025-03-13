<template>
<div class="icon">
    <img v-show="ifShow" :src="src" :alt="name">
</div>
</template>

<script setup lang='ts'>
    import { computed, Ref} from 'vue';
    import { Icon,iconList } from '@/static/list/iconList';
    const {icon,name,show=true} = defineProps<{icon:Icon,name?:string,show?:boolean|Ref<boolean>}>()
    const emits = defineEmits(["click"])
    
    //获取图标
    const src = computed(()=>{
        const fullIcon = iconList[icon]
        const img = "../../static/icon/" + fullIcon
        return new URL(img,import.meta.url).href
    })
    //是否显示
    const ifShow = computed(()=>{
        return show===true
    })

</script>

<style scoped lang='scss'>
.icon{
    img{
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
}
</style>