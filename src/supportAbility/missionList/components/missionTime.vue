<template>
    <div class="missionTime" v-if="mission.state == 'doing'">
        <div>限时：{{ timeDistance }}</div>
        <div>
            截止：
            <Time 
                :value="(mission.planTime as number)" 
                rule="date" 
                unitEnd="分">
            </Time>
        </div>
    </div>
    <div class="missionTime" v-else>
        <div>开始：
            <Time 
                :value="mission.startTime" 
                rule="date" 
                unit-end="分">
            </Time>
        </div>
        <div>截止：
            <Time 
                :value="mission.endTime" 
                rule="date" 
                unit-end="分">
            </Time>
        </div>
    </div>
</template>

<script setup lang='ts'>
import Time from '@/components/global/time.vue';
import { type Mission } from '../missionList';
import { computed } from 'vue';
    const {mission} = defineProps<{mission:Mission}>()
    //显示任务剩余时间 
    const timeDistance = computed(()=>{
        const timeLeft = mission.timeLeft
        if(!timeLeft)return ""
        const day = Math.floor(timeLeft / (24 * 60 * 60 * 1000));
        const hour = Math.floor((timeLeft % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
        const minute = Math.ceil((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
        let str = ""
        if(day>0){
            str += (day+"天")
        }
        if(hour > 0 || day>0){
            str += (hour + "小时")
        }
        str += minute + "分钟"
        return str
    })
</script>

<style scoped lang='scss'>
    .missionTime{
        width: 100%;
        font-size: 0.8rem;
        >div{
            display: flex;
        }
    }
</style>