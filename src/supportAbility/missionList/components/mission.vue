<template>
    <div class="mission">
        <LongTapContainer @longtap="longTap" @click="click" class="contentBar">
            <div class="title">{{ mission.title }}</div>
            <div class="inner" :class="innerExpend?'expend':'unexpend'">
                <MissionTime v-if="mission.timeLeft" :mission="mission"/>
                <TextArea 
                    v-if="mission.inner" 
                    class="missionInner" 
                    v-model="mission.inner" 
                    mode="disabled"/>
                <div class="tags">
                    <MissionTag v-for="tag in mission.tags" :tag="tag"/>
                </div>
            </div>
        </LongTapContainer>
        
        <div class="controlBar">
            <div class="confirmButton" 
                v-show="!manageMode"
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
    import LongTapContainer from '@/components/other/longTapContainer.vue';
    import { manageMode,deleteMission, finishMission, Mission, repeatMission, tryAgain, editMission} from '../missionList';
    import { computed, ref } from 'vue';
    import { showControlPanel } from '@/hooks/controlPanel';

    const {mission} = defineProps<{mission:Mission}>()
    //长按显示控制面板
    function longTap(){
        showControlPanel([
        {
            "text":"编辑/详情",
            click:()=>{editMission(mission)},
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
@use "@/static/style/globalStyle.scss";
.mission{
    box-sizing: border-box;
    width: 100%;
    border: 3px solid black;
    border-radius: 10px;
    padding: 15px;
    margin-bottom: 10px; 
    display: flex;
}

.contentBar{
    width: calc(100% - 150px);
    
}
.title{
    width: 100%;
    font-size: 1.2rem;
    @extend .dontShowMoreText;
}
.inner{
    width: 100%;
    //原本只显示3行内容+1行标签
    .missionInner{
        color: $bgColor40;
    }
    .missionInner::-webkit-scrollbar{
        width: 0;
    }
    .tags{
        width: 100%;
        display: flex;
        flex-wrap: wrap; /* 允许换行 */
    }
    .tags::-webkit-scrollbar{
        width: 0;
    }
}
.inner.unexpend{
    .missionInner{
        max-height: 4rem;
        overflow: hidden;
        @extend .dontShowMoreText;
    }
    .tags{
        max-height: 1.5rem;
        overflow: hidden; /* 超出的部分隐藏 */
    }
}
.inner.expend{
    .missionInner{
        max-height: 600px;
        overflow: auto;
    }
    .tags{
        overflow: auto;
        max-height: 5rem;
    }
}


.controlBar{
    width: 150px;
    display: flex;
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