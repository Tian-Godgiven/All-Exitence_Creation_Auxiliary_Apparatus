<template>
    <div class="mission">
        <LongTapContainer @longtap="longTap" @click="click" class="contentBar">
            <div>
                <div class="title">{{ mission.title }}</div>
                <div class="inner">
                    <MissionTime v-if="mission.timeLeft" :mission="mission"/>
                    <TextArea 
                        v-if="mission.inner" 
                        class="missionInner" 
                        :class="innerExpend?'expend':'unexpend'"
                        v-model="mission.inner" 
                        mode="disabled"/>
                    <div class="tags">
                        <MissionTag v-for="tag in mission.tags" :tag="tag"/>
                    </div>
                </div>
            </div>
        </LongTapContainer>
        
        <div class="controlBar">
            <div class="confirmButton" 
                :style="{backgroundColor:confirmItem.color}" 
                @click="confirmItem.click">{{ confirmItem.text }}</div>
            <div class="dragHandler"></div>
        </div>
    </div>
</template>

<script setup lang='ts'>
    import TextArea from '@/components/other/textArea/textArea.vue';
    import MissionTime from './missionTime.vue';
    import MissionTag from './missionTag.vue';
    import LongTapContainer from '@/components/leftPage/longTapContainer.vue';
    import { deleteMission, finishMission, Mission, repeatMission, tryAgain } from '../missionList';
    import { computed, ref } from 'vue';
    import { showControlPanel } from '@/hooks/controlPanel';

    const {mission} = defineProps<{mission:Mission}>()

    //长按显示控制面板
    function longTap(){
        showControlPanel([{
            "text":"编辑/详情",
            click:()=>{},
        },{
            text:"删除",
            click:()=>{deleteMission(mission)}
        }])
    }

    //点击展开任务内容
    const innerExpend = ref(false)
    function click(){  
        innerExpend.value = !innerExpend.value
    }

    //任务确认对象，根据任务状态改变
    const confirmItem = computed(()=>{
        switch(mission.state){
            case "doing":
                return {
                    text:"结算！",
                    click:()=>finishMission(mission),
                    color:"lightGreen"
                }
            case "completed":
                return {
                    text:`再来\n一次!`,
                    click:()=>repeatMission(mission),//再来一次
                    color:"lightBlue"
                }
            case "failed":
                return {
                    text:`重新\n挑战!`,
                    click:()=>tryAgain(mission),//重新挑战
                    color:"red"
                }
                
        }
    })
</script>

<style scoped lang='scss'>
@use "@/static/style/global.scss" as global;
@use "@/static/style/globalStyle.scss";
.mission{
    box-sizing: border-box;
    width: 100%;
    border: 3px solid black;
    border-radius: 10px;
    padding: 15px;
    margin-bottom: 15px; 
    display: flex;
}

.contentBar{
    width: calc(100% - 100px);
    .title{
        width: calc(100% - 150px);
        font-size: 1.2rem;
        @extend .dontShowMoreText;
    }
    .inner{
        //原本只显示3行
        .missionInner{
            color: global.$bgColor40;
        }
        .missionInner .unexpend{
            max-height: 4em;
            overflow: hidden;
            @extend .dontShowMoreText;
        }
        .missionInner .expend{
            max-height: 600px;
            overflow: auto;
        }
        .missionInner::-webkit-scrollbar{
            width: 0;
        }
        .tags{
            display: flex;
        }
    }
}

.controlBar{
    width: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    .confirmButton{
        white-space: pre;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 3rem;
        border-radius: 10px;
    }
}  
</style>