<template>
<div class="menu">
    <slot :switchMenu></slot>
    <div v-show="showMenu" ref="menuContent" class="menuContent" :style="style">
        <slot name="menu"></slot>
    </div>
</div>
</template>

<script setup lang='ts'>
    import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
    const {start=false,vertical="left",horizen="bottom"} = defineProps<{
        start?:boolean,
        vertical:"left"|"center"|"right",
        horizen:"top"|"bottom"
    }>()
    //控制位置，默认在下方靠左
    const style = computed(()=>{
        if(horizen === "bottom"){
            const top = "100%";
            const left = vertical === "left" ? "2px":"auto"
            const right = vertical === "right" ? "2px":"auto"
            return {
                top,left,right,
            }
        }
        else{
            const top = "0";
            const right = vertical === "left" ? "100%":"auto"
            const left = vertical === "right" ? "100%":"auto"
            return {
                top,left,right,
            }
        }
    })
    //控制显示
    const showMenu = ref(start)
    function switchMenu(state?:boolean){
        if(typeof state == "boolean"){
            showMenu.value = state
        }
        else{
            showMenu.value = !showMenu.value
        }
    }
    //点击到外部关闭
    const content = useTemplateRef("menuContent")
    const clickoutside = function(e:MouseEvent){
        // 判断点击的目标是否是菜单内容区域的外部
        if (content.value && !content.value.contains(e.target as Node)) {
            switchMenu(false)//隐藏
        }
    }
    onMounted(()=>{
        document.addEventListener("click",clickoutside)
    })
    onUnmounted(()=>{
        document.removeEventListener("click",clickoutside)
    })
</script>

<style scoped lang='scss'>
.menu{
    position: relative;
    .menuContent{
        position: absolute;
    }
}
</style>