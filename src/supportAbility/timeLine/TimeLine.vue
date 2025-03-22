<template>
    <div class="timeLine">
        <div class="topBar">
            <Button @click="createNew" name="新建"></Button>
            <div>管理</div>
        </div>
        <div class="container">
            <Line></Line>
        </div>
    </div>
</template>

<script setup lang='ts'>
    import { ref } from 'vue';
    import Button from '@/components/global/Button.vue';
    import Line from './components/Line.vue'
import { nowAllTimeLine, showCreateTimeLinePopUp } from './timeLine';

    const testTimeLine = {}
    //显示新建弹窗
    function createNew(){
        showCreateTimeLinePopUp()
    }
    
</script>

<style scoped lang='scss'>

</style>