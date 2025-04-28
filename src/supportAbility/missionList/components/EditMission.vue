<template>
<div class="editMission">
    <div class="topButtons">
        <Button class="button" name="返回任务列表" @click="cancel" icon="leftArrow"></Button>
        <div class="right">
            <Button class="right button" name="任务限时"  
                @click="editTime()" 
                icon="time"/>
            <Button class="right button" 
                :class="tmpMission.repeatable?'turnOn':''" 
                name="任务重复"
                @click="switchRepeat" 
                icon="repeat"/>
        </div>
       
    </div>

    <DownLineInput class="title" 
        placeholder="输入任务标题" 
        v-model="tmpMission.title">
    </DownLineInput>

    <div class="info">
        <div v-if="tmpMission.repeatTime&&tmpMission.repeatTime>0">已重复：{{ tmpMission.repeatTime }}次</div>
    </div>
    
    <div class="inner">
        <MissionTime v-if="tmpMission.planTime" :mission="tmpMission"></MissionTime>
        <TextArea class="missionInner" v-model="tmpMission.inner" placeholder="输入内容"></TextArea>
        <div class="separator"></div>
        <MissionTagBar :tags="tmpMission.tags"></MissionTagBar>
    </div>
    
    <FinalButtons :buttons="[
        {click:confirm,name:'确认'},
        {click:cancel,name:'取消'}]"/>
</div>
</template>

<script setup lang='ts'>
    import DownLineInput from '@/components/other/input/downLineInput.vue';
    import TextArea from '@/components/other/textArea/textArea.vue';
    import Button from '@/components/global/Button.vue';
    import { computed, reactive, shallowRef, } from 'vue';
    import { showPopUp } from '@/hooks/pages/popUp';
    import { nanoid } from 'nanoid';
    import { cloneDeep } from 'lodash';
    import EditMissionTime from '../popUp/editMissionTime.vue';
    import MissionTime from '../components/missionTime.vue';
    import MissionTagBar from '../components/missionTagBar.vue';
    import { changeMission, changeMissionState, editTarget, ifShowEditMission, Mission } from '../missionList';
    import FinalButtons from '@/app/stacks/popUp/FinalButtons.vue';
    //默认状态，即空任务对象
    const idle:Mission = {
        title:"",
        inner:"",
        startTime:0,
        endTime:0,
        planTime:null,
        timeLeft:null, //限时时间，若为null则表示不限时
        repeatable:false, //是否可重复
        repeatTime:0, //已重复次数
        tags: [], //标签
        state:"doing",
        __key: nanoid() //key值
    }
    //临时编辑对象是源对象的拷贝
    const tmpMission = computed(()=>{
        let tmp:Mission|null = editTarget.value
        //若为空则创建新规则
        if(!tmp){
            tmp = idle
        }
        //拷贝编辑对象
        let newTimeLine:Mission = reactive<Mission>(cloneDeep(tmp))
        return newTimeLine
    })
    //修改任务计时
    function editTime(){
        showPopUp({
            vue:shallowRef(EditMissionTime),
            mask:false,
            buttons:[],
            props:{
                planTime:tmpMission.value.planTime,
                leftTime:tmpMission.value.timeLeft,
            },
            returnValue:(planTime,distantTime)=>{
                //预计结束时间
                tmpMission.value.planTime = planTime
                //限时时间
                tmpMission.value.timeLeft = distantTime
            },
            size:{
                height:"auto"
            }
        })
    }
    //切换可重复性
    function switchRepeat(){
        tmpMission.value.repeatable = !tmpMission.value.repeatable
    }
    //确认
    function confirm(){
        //编辑
        if(editTarget.value){
            changeMission(editTarget.value,tmpMission.value)
        }
        //创建:添加到doing数组
        else{
            changeMissionState(tmpMission.value,"doing")
        }
        ifShowEditMission.value = false
    }
    //取消
    function cancel(){
        ifShowEditMission.value = false
    }
</script>

<style scoped lang='scss'>
@use "@/static/style/components/page.scss";
.editMission{
    .topButtons{
        width: 100%;
        display: flex;
        justify-content: space-between;
        .button{
            width: 60px;
            height: 60px;
            border-radius: 10px;
        }
        >.right{
            display: flex;
            gap:10px;
        }
        .turnOn{
            background-color: lightgreen;
        }
    }
    .title{
        @extend .titleDownLineInput;
    }
    
    .inner{
        margin-top: 15px;
        width: 100%; 
        box-sizing: border-box;
        border: 3px solid black;
        padding: 12px;
        .missionInner{
            max-height: 600px;
            overflow: auto;
            padding: 9px 0;
            width: 100%;
        }
        .missionInner::-webkit-scrollbar{
            width: 0;
        }
        .separator{
            margin-bottom: 15px;
            border-bottom: 3px solid rgb(168, 168, 168);
        }
    }
}


</style>