<template>
<div class="timeLinePopUp">
    <div class="manage">
        <div class="topBar">
            <Button @click="createNew" name="新建"></Button>
            <Button @click="manageMode" name="管理"></Button>
        </div>
        <div class="container">
            <TimeLine v-for="timeLine,index in nowAllTimeLine" 
                :key="index" :timeLine>
            </TimeLine>
        </div>
    </div>

    <SlidePage :show="ifShowCreatePage">
        <CreateTimeLine></CreateTimeLine>
    </SlidePage>
    
</div>

    
</template>

<script setup lang='ts'>
    import Button from '@/components/global/Button.vue';
    import TimeLine from './components/TimeLine.vue'
    import CreateTimeLine from "./popUp/CreateTimeLine/CreateTimeLine.vue"
    import { ifShowCreatePage, nowAllTimeLine, showCreateTimeLine } from './timeLine';
    import SlidePage from '@/components/other/SlidePage.vue';

    //显示新建时间线
    function createNew(){
        showCreateTimeLine()
    }

    //管理模式
    function manageMode(){
        
    }
    
</script>

<style scoped lang='scss'>
.timeLinePopUp{
    overflow: hidden;
    position: relative;
    width: 100%;
    height: 100%;
    .manage{
        .topBar{

        }
        .container{
            height: calc(100% - 50px);
        }
    }
}
</style>