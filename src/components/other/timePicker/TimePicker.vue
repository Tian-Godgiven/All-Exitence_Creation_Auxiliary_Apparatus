<template>
    <div class="timePicker">
        <ElPopover trigger="click" class="popover" width="60%">
            <template #reference>
                <Time class="time" :time-value="timeValue" time-rule="date" unit-from="hour" unit-end="minute"></Time>
            </template>
            <div class="picker">
                <VueScrollPicker :options="hours" v-model="hour" />
                <VueScrollPicker :options="minutes" v-model="minute" />
            </div>
        </ElPopover>
    </div>
</template>

<script setup lang='ts'>
    import Time from '@/components/global/time.vue';
    import { reactive, ref, watch, watchEffect} from 'vue';
    import { ElPopover } from 'element-plus';
    const date = defineModel<number>({default:Date.now()})
    const timeValue = reactive({
        unit:"date",
        number:date
    })

    //用于选择器
    const hours = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, '0'))
    const minutes = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, '0'))
    const hour = ref(0)
    const minute = ref(0)
    watchEffect(()=>{
        hour.value = new Date(date.value).getHours()
        minute.value = new Date(date.value).getMinutes()
    })
    //监听值变化
    watch([hour,minute],()=>{
        const newDate = new Date(date.value)
        newDate.setHours(hour.value,minute.value)
        date.value = newDate.getTime()
        timeValue.number = newDate.getTime()
    })
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