<template>
<div class="timeLinePopUp">
    <div class="manage">
        <div class="topBar">
            <Button @click="createNew" name="新建"></Button>
            <Button @click="manageTimeLine" name="管理"></Button>
        </div>
        <div class="container">
            <TimeLine v-for="timeLine,index in nowAllTimeLine" 
                :key="timeLine.__key??index" :timeLine>
            </TimeLine>
        </div>
    </div>

    <SlidePage :show="ifShowCreatePage">
        <EditTimeLine></EditTimeLine>
    </SlidePage>
    
</div>

    
</template>

<script setup lang='ts'>
    import Button from '@/components/global/Button.vue';
    import TimeLine from './components/TimeLine.vue'
    import EditTimeLine from "./popUp/editTimeLine/EditPage.vue"
    import { nowAllTimeLine } from './timeLine';
    import SlidePage from '@/components/other/SlidePage.vue';
    import { ifShowCreatePage ,showEditTimeLine} from './popUp/editTimeLine/editTimeLine.ts';
    import { provide, ref } from 'vue';

    //新建时间线
    function createNew(){
        showEditTimeLine(null)
    }

    const manageMode = ref(false)
    provide("manageMode",manageMode)
    //管理模式
    function manageTimeLine(){
        manageMode.value = !manageMode.value
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