<template>
    <div class="timeLine">
        <div class="topBar">
            <Button @click="createNew" name="新建"></Button>
            <div>管理</div>
        </div>
        <div class="container">
            <Line v-for="timeLine in nowAllTimeLine" :timeLine="timeLine"></Line>
        </div>
    </div>
</template>

<script setup lang='ts'>
    import { ref } from 'vue';
    import Button from '@/components/global/button.vue';
    import Line from '../components/Line.vue'
import { nowAllTimeLine, showCreateTimeLinePopUp } from '../timeLine';

    //显示新建弹窗
    function createNew(){
        showCreateTimeLinePopUp()
    }
</script>

<style scoped lang='scss'>

</style>