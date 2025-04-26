<template>
<div class="menu">
    <slot :switchMenu></slot>
    <div v-show="showMenu" class="menuContent" :style="style">
        <slot name="menu"></slot>
    </div>
</div>
</template>

<script setup lang='ts'>
    import { computed, ref } from 'vue';
    const {title,start=false,vertical="left",horizen="bottom"} = defineProps<{
        title?:string,
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
</script>

<style scoped lang='scss'>
.menu{
    position: relative;
    .title{

    }
    .menuContent{
        position: absolute;
    }
}
</style>