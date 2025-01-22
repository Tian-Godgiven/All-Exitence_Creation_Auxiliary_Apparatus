<template>
    <div class="editMission">
        <div class="topBar">
            <div class="topButtons">
                <Button class="missionTime" name="任务限时"  @click="editTime" icon="time"></Button>
		        <Button class="missionRepeat" :class="tmpMission.repeatable?'turnOn':''" name="任务重复"
                    @click="switchRepeat" icon="repeat"></Button>
            </div>

            <DownLineInput class="title" 
                placeholder="输入任务标题" 
                v-model="tmpMission.title">
            </DownLineInput>
        </div>

        <div class="info">
            <div v-if="tmpMission.repeatTime&&tmpMission.repeatTime>0">已重复：{{ tmpMission.repeatTime }}次</div>
        </div>
        
        <div class="inner">
            <MissionTime v-if="tmpMission.planTime" :mission="tmpMission"></MissionTime>
            <TextArea class="missionInner" v-model="tmpMission.inner" placeholder="输入内容"></TextArea>
            <div class="separator"></div>
            <MissionTagBar :tags="tmpMission.tags"></MissionTagBar>
        </div>
        
        <div class="finalButtons">
            <Button @click="confirm" name="确认">确认</Button>
            <Button @click="closePopUp(popUp)" name="取消">取消</Button>
        </div>
    </div>
</template>

<script setup lang='ts'>
    import DownLineInput from '@/components/other/input/downLineInput.vue';
    import TextArea from '@/components/other/textArea/textArea.vue';
    import Button from '@/components/global/button.vue';
    import { Reactive, reactive, shallowRef, toRaw } from 'vue';
    import { closePopUp, PopUp, showPopUp } from '@/hooks/pages/popUp';
    import { nanoid } from 'nanoid';
    import { cloneDeep } from 'lodash';
    import EditMissionTime from './editMissionTime.vue';
    import MissionTime from '../components/missionTime.vue';
    import MissionTagBar from '../components/missionTagBar.vue';
    import { Mission } from '../missionList';

    const {popUp,returnValue,props={}} = defineProps<{popUp:PopUp,returnValue:(...args:any[])=>void,props:any}>()
    let {mission=null}:{mission:Mission|null} = props
    if(!mission){
        mission = {
            title:"",
            inner:"",
            startTime:Date.now(),
            endTime:0,
            planTime:null,
            timeLeft:null, //限时时间，若为null则表示不限时
	        repeatable:false, //是否可重复
	        repeatTime:0, //已重复次数
	        tags: [], //标签
            state:"doing",
            __key: nanoid() //key值
        }
    }
    //创建临时任务对象
    const tmpMission:Reactive<Mission> = reactive(cloneDeep(mission))

    //修改任务计时
    function editTime(){
        showPopUp({
            vue:shallowRef(EditMissionTime),
            mask:false,
            buttons:[],
            props:{
                planTime:tmpMission.planTime,
                leftTime:tmpMission.timeLeft,
            },
            returnValue:(planTime,distantTime)=>{
                console.log(planTime,distantTime)
                //预计结束时间
                tmpMission.planTime = planTime
                //限时时间
                tmpMission.timeLeft = distantTime
            },
            size:{
                height:"auto"
            }
        })
    }
    //切换可重复性
    function switchRepeat(){
        tmpMission.repeatable = !tmpMission.repeatable
    }
    //确认
    function confirm(){
        //返回临时任务对象的值
        returnValue(toRaw(tmpMission))
        //关闭弹窗
        closePopUp(popUp)
    }
</script>

<style scoped lang='scss'>
@use "@/static/style/globalStyle.scss";
@use "@/static/style/popUp.scss";
.editMission{
    height: 100%;
    .topBar{
        width: 100%;
        .title{
            width: calc(100% - 150px);
            @extend .titleDownLine;
        }
        .topButtons{
            margin-left: auto;
            width: 130px;
            float: right;
            display: flex;
            gap: 10px;
            >div{
                box-sizing: border-box;
                width: 60px;
                height: 60px;
                border: 4px solid black;
                border-radius: 10px;
            }
            >.turnOn{
                background-color: lightgreen;
            }
        }
        
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
    

    .finalButtons{
        @extend .finalButtons;
    }
}


</style>