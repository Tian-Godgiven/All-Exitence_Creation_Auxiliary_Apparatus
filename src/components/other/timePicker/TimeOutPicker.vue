<template>
    <div class="timeOutPicker">
        <ElPopover trigger="click" class="popover" width="60%">
            <template #reference>
                限时：{{ timeoutText }}
            </template>
            <ScrollTimePicker class="picker" :time="timePickerItem" @onChange="onChange"></ScrollTimePicker>
        </ElPopover>
    </div>
    
</template>

<script setup lang='ts'>
    import { computed, reactive } from 'vue';
    import { addHours, addMinutes, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';
    import { ElPopover } from 'element-plus';
    import ScrollTimePicker from './scrollTimePicker.vue';
    const targetTime = defineModel<number>({default:Date.now()})
    const {startTime = Date.now()} = defineProps<{startTime:number}>()

    //时间差
    const timeoutText = computed(()=>{
        if(targetTime.value < startTime){
            return "0分钟"
        }
        const days = differenceInDays(targetTime.value,startTime)
        const diffMinute = differenceInMinutes(targetTime.value,startTime) % 60
        const diffHour = differenceInHours(targetTime.value,startTime) % 24
        let str = ""
        if(days>0){
            str += (days+"天")
        }
        if(diffHour > 0 || days>0){
            str += (diffHour + "小时")
        }
        str += diffMinute + "分钟"
        //同步到选择器
        timePickerItem.hour = diffHour;
        timePickerItem.minute = diffMinute
        return str
    })

    //选择器对象
    const timePickerItem = reactive({
        hour:0,
        minute:0
    })
    function onChange(newHour:number,newMinute:number){
        //把targetTime修改为startTime+newTimeout
        let newDate = new Date(startTime)
        newDate = addHours(newDate,newHour)
        newDate = addMinutes(newDate,newMinute)
        
        targetTime.value = newDate.getTime()
    }
</script>

<style scoped lang='scss'>

    .picker{
        width:350px;
        height:200px;
    }

</style>