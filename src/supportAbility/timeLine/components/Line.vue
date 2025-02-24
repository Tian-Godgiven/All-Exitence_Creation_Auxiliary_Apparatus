<template>
    <div class="timeLine">
        <div>一条无限向后的直线
             
        </div>
        <div>时间刻度</div>
    </div>
</template>

<script setup lang='ts'>
    import { computed, ref } from 'vue';
import { TimeLine } from '../timeLine';
    const {timeLine} = defineProps<{timeLine:TimeLine}>()
    //时间轴上的各个对象
    const itemList = computed(()=>{
        
    })

    //点击到时间轴
    function clickLine(){
        //将指定位置聚焦，移动其到中心
    }
    //拖动时间轴
</script>

<style scoped lang='scss'>

</style>