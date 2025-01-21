<template>
    <div class="datePicker">
        <ElPopover trigger="click" class="popover" width="80%">
            <template #reference>
                <Time class="time" :time-value="timeValue" time-rule="date" unit-from="year" unit-end="day"></Time>
            </template>
            <scrollDatePicker class="picker" :current-date="timeValue.number" @onChange="onChange"></scrollDatePicker>
        </ElPopover>
    </div>
</template>

<script setup lang='ts'>
    import Time from '@/components/global/time.vue';
    import scrollDatePicker from './scrollDatePicker.vue';
    import { reactive} from 'vue';
    import { ElPopover } from 'element-plus';
    const date = defineModel<number>({default:Date.now()})
    const timeValue = reactive({
        unit:"date",
        number:date
    })
    function onChange(newYear:number,newMonth:number,newDay:number){
        const newDate = new Date(date.value)
        newDate.setFullYear(newYear,newMonth,newDay)
        date.value = newDate.getTime()
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
    .picker{
        width:500px;
        height:200px;
    }
</style>