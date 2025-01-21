<template>
    <div class="timeOutPicker">
        <ElPopover trigger="click" class="popover" width="60%">
            <template #reference>
                限时：{{ timeoutText }}
            </template>
            <div class="picker">
                <VueScrollPicker :options="hours" v-model="diffHour" />
                <VueScrollPicker :options="minutes" v-model="diffMinute" />
            </div>
        </ElPopover>
    </div>
    
</template>

<script setup lang='ts'>
    import { computed, ref, watch } from 'vue';
    import { addHours, addMinutes, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';
    import { ElPopover } from 'element-plus';
    const targetTime = defineModel<number>({default:Date.now()})
    const {startTime = Date.now()} = defineProps<{startTime:number}>()

    const hours = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, '0'))
    const minutes = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, '0'))

    //时间差
    const diffHour = ref(0)
    const diffMinute = ref(0)
    const timeoutText = computed(()=>{
        if(targetTime.value < startTime){
            return "0分钟"
        }
        const days = differenceInDays(targetTime.value,startTime)
        diffMinute.value = differenceInMinutes(targetTime.value,startTime) % 60
        diffHour.value= differenceInHours(targetTime.value,startTime) % 24
        let str = ""
        if(days>0){
            str += (days+"天")
        }
        if(diffHour.value > 0 || days>0){
            str += (diffHour.value + "小时")
        }
        str += diffMinute.value + "分钟"
        console.log(str)
        return str
    })

    //监听值变化
    watch([diffHour,diffMinute],()=>{
        //把targetTime修改为startTime+newTimeout
        let newDate = new Date(startTime)
        newDate = addHours(newDate,diffHour.value)
        newDate = addMinutes(newDate,diffMinute.value)
        targetTime.value = newDate.getTime()
    })
</script>

<style scoped lang='scss'>

    .picker{
        display: flex;
        width:350px;
        height:200px;
        .vue-scroll-picker{
            width: 100%;
            height: 100%;
        }
        :deep(.vue-scroll-picker-item){
            line-height: 1.5rem;
        }
    }

</style>