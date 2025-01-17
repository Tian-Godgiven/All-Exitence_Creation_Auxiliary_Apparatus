<template>
    <div class="mission">
        <div class="topBar">
            <div class="title">{{ mission.title }}</div>
            <div class="state">{{ missionState }}</div>
        </div>
        
        <div class="inner">
            <MissionTime v-if="mission.timeLimit" :time="mission.timeLimit"></MissionTime>
            <TextArea class="missionInner" v-model="mission.inner" placeholder="输入内容"></TextArea>
            <MissionTagBar :tags="mission.tags"></MissionTagBar>
        </div>
        
        <div class="dragHandler">拖动手柄</div>
        <div class="sideButtons">←滑显示编辑and删除键</div>
    </div>
</template>

<script setup lang='ts'>
    import TextArea from '@/components/other/textArea/textArea.vue';
    import MissionTime from './missionTime.vue';
    import MissionTagBar from './missionTagBar.vue';
    import { Mission } from '../missionList';
import { computed } from 'vue';

    const {mission} = defineProps<{mission:Mission}>()
    const missionState = computed(()=>{
        if(mission.repeatable){
            return "x"+mission.repeatTime+"！"
        }
        return mission.state
    })
</script>

<style scoped lang='scss'>
@use "@/static/style/global.scss" as global;
.mission{
    border: 3px solid black;
    border-radius: 10px;
    padding: 20px;
    .topBar{
        .title{
            font-size: global.$midFontSize;
        }
    }
    .inner{
        .missionInner{
            pointer-events: none;
        }
    }
}
</style>