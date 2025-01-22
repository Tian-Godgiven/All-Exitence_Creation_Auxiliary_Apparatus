<template>
    <div class="missionTime">
        <div>限时：{{ timeDistance }}</div>
        <div>
            <Time :time-value="timeValue" time-rule="date" unit-end="minute"></Time>
        </div>
        
    </div>
</template>

<script setup lang='ts'>
import Time from '@/components/global/time.vue';
import { Mission } from '../missionList';
import { computed } from 'vue';
    const {mission} = defineProps<{mission:Mission}>()
    //显示任务剩余时间 
    const timeDistance = computed(()=>{
        const timeLeft = mission.timeLeft
        if(!timeLeft)return ""
        const day = Math.floor(timeLeft / (24 * 60 * 60 * 1000));
        const hour = Math.floor((timeLeft % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
        const minute = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
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
    //时间点
    const timeValue = computed(()=>{
        return {
            unit:"date",
            number:mission.planTime as number
        }
    })
</script>

<style scoped lang='scss'>
    .missionTime{
        width: 100%;
        max-height: 1rem;
        font-size: 0.8rem;
    }
</style>