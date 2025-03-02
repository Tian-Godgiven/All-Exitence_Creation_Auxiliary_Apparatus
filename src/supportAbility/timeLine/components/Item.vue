<template>
    <div class="timeLineItem">
        点击跳转到指定对象
    </div>
</template>

<script setup lang='ts'>
    import { ref } from 'vue';
    const {item,index} = defineProps<{item:{time:number,item:any},index:number}>()
    //点击到指定对象跳转or显示到该位置
    function clickItem(){
        
    }
</script>

<style scoped lang='scss'>

</style>