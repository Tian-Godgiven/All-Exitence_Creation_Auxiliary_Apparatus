<template>
    <div class="datePicker">
        <ElPopover trigger="click" class="popover" width="80%">
            <template #reference>
                <Time class="time" :time-value="timeValue" time-rule="date" unit-from="year" unit-end="day"></Time>
            </template>
            <ScrollDatePicker :time="timeItem" @on-change="onChange"></ScrollDatePicker>
        </ElPopover>
    </div>
</template>

<script setup lang='ts'>
    import Time from '@/components/global/time.vue';
    import { reactive, watch } from 'vue';
    import { ElPopover } from 'element-plus';
    import ScrollDatePicker from './scrollDatePicker.vue';

    const date = defineModel<number>({default:Date.now()})
    const timeValue = reactive({
        unit:"date",
        number:date
    })
    //选择器的值
    const timeItem = reactive({
        year:0,
        month:0,
        day:0
    })
    //显示选择器时，更新选择器的值
    watch(date,()=>{
        const theDate = new Date(date.value)
        timeItem.year = theDate.getFullYear()
        timeItem.month = theDate.getMonth()+1,
        timeItem.day = theDate.getDate()
    },{immediate:true})
    //选择器的值发生变化时
    function onChange(){
        const newDate = new Date(date.value)
        newDate.setFullYear(timeItem.year,timeItem.month-1,timeItem.day)
        //更新date对象
        date.value = newDate.getTime()
        //更新time的显示内容
        timeValue.number = newDate.getTime()
    }
</script>

<style scoped lang='scss'>
    .datePicker{
        width: 250px;
    }
    .time{
        text-align: center;
        border: 3px solid rgb(167, 167, 167);
        border-radius: 10px;
    }
    .picker {
        width:500px;
        height:200px;
    }
</style>