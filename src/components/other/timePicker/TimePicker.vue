<template>
    <div class="timePicker">
        <ElPopover trigger="click" class="popover" width="60%">
            <template #reference>
                <Time class="time" :time-value="timeValue" time-rule="date" unit-from="hour" unit-end="minute"></Time>
            </template>
            <ScrollTimePicker class="picker" :time="timeItem" @onChange="onChange"></ScrollTimePicker>
        </ElPopover>
    </div>
</template>

<script setup lang='ts'>
    import Time from '@/components/global/time.vue';
    import { reactive,computed, watch } from 'vue';
    import { ElPopover } from 'element-plus';
    import ScrollTimePicker from './scrollTimePicker.vue';
    const date = defineModel<number>({default:Date.now()})
    const timeValue = reactive({
        unit:"date",
        number:date
    })

    //用于选择器
    const timeItem = reactive({
        hour:0,
        minute:0
    })
    watch(date,()=>{
        const theDate = new Date(date.value)
        timeItem.hour = theDate.getHours()
        timeItem.minute = theDate.getMinutes()
    })
    //值变化函数
    function onChange(){
        const newDate = new Date(date.value)
        newDate.setHours(timeItem.hour,timeItem.minute)
        date.value = newDate.getTime()
        timeValue.number = newDate.getTime()
    }
</script>

<style scoped lang='scss'>
.timePicker{
    width: 150px;
}
    .time{
        text-align: center;
        width: 100%;
        border: 3px solid rgb(167, 167, 167);
        border-radius: 10px;
    }

    .picker{
        width:350px;
        height:200px;
    }

</style>